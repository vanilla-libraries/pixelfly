import { Random } from "./Random";
import { jsh } from "./jsh";

type ConfigFunction<T> = T | (() => T);
type ConfigTuple<T> = T | [T, T];

export interface PixelflyProps {
  /**
   * Color palette to use when generating the image \
   * The first color is considered the background
   */
  colors: ConfigFunction<string[]>;

  /**
   * Add an inner margin along the image so it looks nicer
   * For example, `[1, 1]` means the outer ring of "pixels" will have the background color
   */
  margin: ConfigTuple<number>;

  /**
   * Number of "pixels" the image will have
   */
  gridSize: ConfigTuple<number>;

  /**
   * "Size" of the image "pixels" \
   * gridSize * pixelSize = imageSize (but Pixelfly exports SVGs so it doesn't matter)
   */
  pixelSize: ConfigTuple<number>;
}

export class Pixelfly {
  private colors: PixelflyProps["colors"];
  private margin: PixelflyProps["margin"];
  private gridSize: PixelflyProps["gridSize"];
  private pixelSize: PixelflyProps["pixelSize"];

  readonly generator = new Random();

  constructor({
    gridSize = 10,
    pixelSize = 8,
    margin = 1,
    colors = ["#710b2c", "#fd8978"],
  }: Partial<PixelflyProps> = {}) {
    this.gridSize = gridSize;
    this.pixelSize = pixelSize;
    this.margin = margin;
    this.colors = colors;
  }

  /**
   * Resolve a configuration function into its actual value \
   * Allows library users to dynamically/randomly change values
   * @param config
   * @returns
   */
  private resolve<T>(config: ConfigFunction<T>): T {
    // https://github.com/microsoft/TypeScript/issues/37663
    // should work here but does not work with Records apparently
    if (config instanceof Function) {
      return config();
    }

    return config;
  }

  /**
   * Convert a single value or tuple of values into an tuple of values
   * @param value Single value or tuple of values
   * @returns Tuple of values
   */
  private extract<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value, value];
  }

  /**
   * Create an empty grid
   * @param gridWidth Resolved grid width
   * @param gridHeight Resolved grid height
   * @param backgroundColor Default grid color
   * @returns A 2D array of the background color
   */
  createGrid(
    gridWidth: number,
    gridHeight: number,
    backgroundColor: string = "black"
  ) {
    return new Array(gridHeight)
      .fill(0)
      .map(() => new Array(gridWidth).fill(backgroundColor));
  }

  /**
   * Create the profile picture
   * @param seed Seed the random generator should use
   * @returns Profile picture, in array form
   */
  createData() {
    // resolve config values
    const colors = this.resolve(this.colors);
    const [marginX, marginY] = this.extract(this.resolve(this.margin));
    const [gridWidth, gridHeight] = this.extract(this.resolve(this.gridSize));
    const [pixelWidth, pixelHeight] = this.extract(
      this.resolve(this.pixelSize)
    );

    // generate data
    const grid = this.createGrid(gridWidth, gridHeight, colors[0]);
    for (let y = marginY; y < gridHeight - marginY; y++) {
      for (let x = marginX; x < gridWidth / 2; x++) {
        const color =
          colors[Math.floor(this.generator.random() * colors.length)];
        grid[y][x] = color;
        grid[y][gridWidth - x - 1] = color;
      }
    }

    return {
      grid,

      // store all config variables with the grid so
      // (1) we don't have to compute them again
      // (2) we can reuse the same config when building the SVG
      config: {
        colors,
        marginX,
        marginY,
        gridWidth,
        gridHeight,
        pixelWidth,
        pixelHeight,
      },
    };
  }

  /**
   * Create an SVG image from the generated grid data \
   * This can then be appropriately returned as an image response
   */
  createSVG(seed: number) {
    // set the seed of the random generator
    this.generator.seed(seed);

    // generate the grid & compute config values
    const { grid, config } = this.createData();
    const svgWidth = config.gridWidth * config.pixelWidth;
    const svgHeight = config.gridHeight * config.pixelHeight;
    const background = config.colors[0];

    return jsh(
      "svg",
      {
        width: svgWidth,
        height: svgHeight,
        viewBox: `0 0 ${svgWidth} ${svgHeight}`,
        fill: background,
        xmlns: "http://www.w3.org/2000/svg",
      },
      grid.map((row, y) =>
        row.map((cell, x) =>
          jsh("rect", {
            x: x * config.pixelWidth,
            y: y * config.pixelHeight,
            width: config.pixelWidth,
            height: config.pixelHeight,
            fill: cell,
          })
        )
      )
    );
  }
}

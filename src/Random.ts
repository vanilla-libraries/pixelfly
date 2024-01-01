// adapted from StackOverflow
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
// > No, but here's a simple pseudorandom generator, an implementation of Multiply-with-carry I adapted from Wikipedia (has been removed since):

export class Random {
  private m_w = 123456789;
  private m_z = 987654321;
  private readonly mask = 0xffffffff;

  /**
   * Set the seed of the random generator
   * @param i Any integer
   */
  seed(i: number) {
    this.m_w = (123456789 + i) & this.mask;
    this.m_z = (987654321 - i) & this.mask;
  }

  /**
   * Return a random number between 0.0 (inclusive) and 1.0 (exlusive)
   * @returns A pseudo random number
   */
  random() {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
    this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
    return (((this.m_z << 16) + (this.m_w & 65535)) >>> 0) / 4294967296;
  }
}

class Parameter {
  /**
   * Creates an instance of QueryBuilder.
   * @param {string} options.prefix - The prefix to be used.
   */
  constructor() {
    this.count = 1;
    this.values = [];
    this.history = {};
  }

  /**
   * Adds a value to the parameter and returns its index.
   * If a tag is provided and it exists in the history, the index from the history is returned.
   * Otherwise, the value is added to the parameter and its index is returned.
   *
   * @param {*} value - The value to be added to the parameter.
   * @param {string} tag - The tag associated with the value to avoid duplicates in the parameter.
   * @returns {number} - The index of the added value.
   */

  i(value, tag) {
    if (tag && this.history[tag]) return this.history[tag];

    this.values.push(value);
    if (tag) this.history[tag] = this.values.length;
    return this.values.length;
  }

  $i(value, tag) {
    return `$${this.i(value, tag)}`;
  }

  di(value, tag) {
    return `$${this.i(value, tag)}`;
  }
}

module.exports = {
  Parameter,
};

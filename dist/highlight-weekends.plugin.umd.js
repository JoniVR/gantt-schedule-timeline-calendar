(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.HighlightWeekends = {}));
}(this, (function (exports) { 'use strict';

  class Action {
      constructor() {
          this.isAction = true;
      }
  }
  Action.prototype.isAction = true;

  /**
   * Schedule - a throttle function that uses requestAnimationFrame to limit the rate at which a function is called.
   *
   * @param {function} fn
   * @returns {function}
   */
  /**
   * Is object - helper function to determine if specified variable is an object
   *
   * @param {any} item
   * @returns {boolean}
   */
  function isObject(item) {
      return item && typeof item === 'object' && item.constructor && item.constructor.name === 'Object';
  }
  /**
   * Merge deep - helper function which will merge objects recursively - creating brand new one - like clone
   *
   * @param {object} target
   * @params {[object]} sources
   * @returns {object}
   */
  function mergeDeep(target, ...sources) {
      const source = sources.shift();
      if (isObject(target) && isObject(source)) {
          for (const key in source) {
              if (isObject(source[key])) {
                  if (typeof source[key].clone === 'function') {
                      target[key] = source[key].clone();
                  }
                  else {
                      if (typeof target[key] === 'undefined') {
                          target[key] = {};
                      }
                      target[key] = mergeDeep(target[key], source[key]);
                  }
              }
              else if (Array.isArray(source[key])) {
                  target[key] = new Array(source[key].length);
                  let index = 0;
                  for (let item of source[key]) {
                      if (isObject(item)) {
                          if (typeof item.clone === 'function') {
                              target[key][index] = item.clone();
                          }
                          else {
                              target[key][index] = mergeDeep({}, item);
                          }
                      }
                      else {
                          target[key][index] = item;
                      }
                      index++;
                  }
              }
              else {
                  target[key] = source[key];
              }
          }
      }
      if (!sources.length) {
          return target;
      }
      return mergeDeep(target, ...sources);
  }

  /**
   * Weekend highlight plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  function Plugin(options = {}) {
      const weekdays = options.weekdays || [6, 0];
      let className;
      let api;
      let enabled = true;
      class WeekendHighlightAction extends Action {
          constructor(element, data) {
              super();
              this.highlight(element, data.time.leftGlobal);
          }
          update(element, data) {
              this.highlight(element, data.time.leftGlobal);
          }
          highlight(element, time) {
              const hasClass = element.classList.contains(className);
              if (!enabled) {
                  if (hasClass) {
                      element.classList.remove(className);
                  }
                  return;
              }
              const isWeekend = weekdays.includes(api.time.date(time).day());
              if (!hasClass && isWeekend) {
                  element.classList.add(className);
              }
              else if (hasClass && !isWeekend) {
                  element.classList.remove(className);
              }
          }
      }
      return function initialize(vidoInstance) {
          const subs = [];
          const pluginPath = 'config.plugin.HighlightWeekends';
          api = vidoInstance.api;
          className = options.className || api.getClass('chart-timeline-grid-row-cell') + '--weekend';
          const currentOptions = vidoInstance.state.get(pluginPath);
          if (currentOptions) {
              options = mergeDeep({}, options, currentOptions);
          }
          subs.push(vidoInstance.state.subscribe('$data.chart.time.format.period', (period) => (enabled = period === 'day')));
          vidoInstance.state.update('config.actions.chart-timeline-grid-row-cell', (actions) => {
              actions.push(WeekendHighlightAction);
              return actions;
          });
          return function onDestroy() {
              subs.forEach((unsub) => unsub());
              vidoInstance.state.update('config.actions.chart-timeline-grid-row-cell', (actions) => {
                  return actions.filter((action) => action !== WeekendHighlightAction);
              });
          };
      };
  }

  exports.Plugin = Plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=highlight-weekends.plugin.umd.js.map

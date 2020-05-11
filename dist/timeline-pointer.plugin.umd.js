(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.TimelinePointer = {}));
}(this, (function (exports) { 'use strict';

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
      return item && typeof item === 'object' && !Array.isArray(item);
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
   * TimelinePointer plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  const CELL = 'chart-timeline-grid-row-cell';
  const ITEM = 'chart-timeline-items-row-item';
  function generateEmptyData(options = {}) {
      const result = {
          enabled: true,
          isMoving: false,
          pointerState: 'up',
          currentTarget: null,
          realTarget: null,
          targetType: '',
          targetData: null,
          offset: { top: 0, left: 0 },
          captureEvents: {
              down: false,
              up: false,
              move: false,
          },
          initialPosition: { x: 0, y: 0 },
          currentPosition: { x: 0, y: 0 },
          events: {
              down: null,
              move: null,
              up: null,
          },
      };
      if (options.captureEvents) {
          result.captureEvents = Object.assign(Object.assign({}, result.captureEvents), options.captureEvents);
      }
      return result;
  }
  const pluginPath = 'config.plugin.TimelinePointer';
  class TimelinePointer {
      constructor(options, vido) {
          this.unsub = [];
          this.classNames = {
              cell: '',
              item: '',
          };
          this.vido = vido;
          this.api = vido.api;
          this.state = vido.state;
          this.element = this.state.get(`$data.elements.chart-timeline`);
          this.pointerDown = this.pointerDown.bind(this);
          this.pointerMove = this.pointerMove.bind(this);
          this.pointerUp = this.pointerUp.bind(this);
          this.data = generateEmptyData(options);
          this.classNames.cell = this.api.getClass(CELL);
          this.classNames.item = this.api.getClass(ITEM);
          this.destroy = this.destroy.bind(this);
          this.element.addEventListener('pointerdown', this.pointerDown /*, this.data.captureEvents.down*/);
          document.addEventListener('pointerup', this.pointerUp /*, this.data.captureEvents.up*/);
          document.addEventListener('pointermove', this.pointerMove /*, this.data.captureEvents.move*/);
          this.unsub.push(this.state.subscribe(pluginPath, (value) => (this.data = value)));
          this.unsub.push(this.state.subscribe('config.scroll.vertical.offset', (offset) => {
              this.data.offset.left = offset;
              this.updateData();
          }));
      }
      destroy() {
          this.element.removeEventListener('pointerdown', this.pointerDown);
          document.removeEventListener('pointerup', this.pointerUp);
          document.removeEventListener('pointermove', this.pointerMove);
      }
      updateData() {
          this.state.update(pluginPath, () => (Object.assign({}, this.data)));
      }
      getRealTarget(ev) {
          let realTarget = ev.target.closest('.' + this.classNames.item);
          if (realTarget) {
              return realTarget;
          }
          realTarget = ev.target.closest('.' + this.classNames.cell);
          if (realTarget) {
              return realTarget;
          }
          return null;
      }
      getRealPosition(ev) {
          const pos = { x: 0, y: 0 };
          if (this.element) {
              const bounding = this.element.getBoundingClientRect();
              pos.x = ev.x - bounding.x;
              pos.y = ev.y - bounding.y;
              const scrollOffsetTop = this.state.get('config.scroll.vertical.offset') || 0;
              pos.y += scrollOffsetTop;
          }
          return pos;
      }
      pointerDown(ev) {
          if (!this.data.enabled)
              return;
          this.data.pointerState = 'down';
          this.data.currentTarget = ev.target;
          this.data.realTarget = this.getRealTarget(ev);
          if (this.data.realTarget) {
              if (this.data.realTarget.classList.contains(this.classNames.item)) {
                  this.data.targetType = ITEM;
                  // @ts-ignore
                  this.data.targetData = this.data.realTarget.vido.item;
              }
              else if (this.data.realTarget.classList.contains(this.classNames.cell)) {
                  this.data.targetType = CELL;
                  // @ts-ignore
                  this.data.targetData = this.data.realTarget.vido;
              }
              else {
                  this.data.targetType = '';
              }
          }
          else {
              this.data.targetType = '';
              this.data.targetData = null;
          }
          this.data.isMoving = !!this.data.realTarget;
          this.data.events.down = ev;
          this.data.events.move = ev;
          const realPosition = this.getRealPosition(ev);
          this.data.initialPosition = realPosition;
          this.data.currentPosition = realPosition;
          this.updateData();
      }
      pointerUp(ev) {
          if (!this.data.enabled)
              return;
          this.data.pointerState = 'up';
          this.data.isMoving = false;
          this.data.events.up = ev;
          this.data.currentPosition = this.getRealPosition(ev);
          this.updateData();
      }
      pointerMove(ev) {
          if (!this.data.enabled || !this.data.isMoving)
              return;
          this.data.pointerState = 'move';
          this.data.events.move = ev;
          this.data.currentPosition = this.getRealPosition(ev);
          this.updateData();
      }
  }
  function Plugin(options) {
      return function initialize(vidoInstance) {
          const currentOptions = vidoInstance.state.get(pluginPath);
          if (currentOptions) {
              options = mergeDeep({}, options, currentOptions);
          }
          const subs = [];
          const defaultData = generateEmptyData(options);
          // for other plugins that are initialized before elements are saved
          vidoInstance.state.update(pluginPath, defaultData);
          // initialize only if chart element is mounted
          let timelinePointerDestroy;
          subs.push(vidoInstance.state.subscribe('$data.elements.chart-timeline', (timelineElement) => {
              if (timelineElement) {
                  if (timelinePointerDestroy)
                      timelinePointerDestroy();
                  const timelinePointer = new TimelinePointer(options, vidoInstance);
                  timelinePointerDestroy = timelinePointer.destroy;
              }
          }));
          return function destroy() {
              subs.forEach((unsub) => unsub());
              if (timelinePointerDestroy)
                  timelinePointerDestroy();
          };
      };
  }

  exports.CELL = CELL;
  exports.ITEM = ITEM;
  exports.Plugin = Plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=timeline-pointer.plugin.umd.js.map

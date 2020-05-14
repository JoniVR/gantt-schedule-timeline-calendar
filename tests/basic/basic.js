const iterations = 100;

const pallete = [
  '#E74C3C',
  '#DA3C78',
  '#7E349D',
  '#0077C0',
  '#07ABA0',
  '#0EAC51',
  '#F1892D',
  '#E3724B',
  '#AE7C5B',
  '#6C7A89',
  '#758586',
  '#707070',
];

const rows = {};
for (let i = 0; i < iterations; i++) {
  const withParent = i > 0 && i % 2 === 0;
  const id = i.toString();
  rows[id] = {
    id,
    label: `row id: ${id}`,
    progress: 50,
    parentId: withParent ? (i - 1).toString() : undefined,
    expanded: false,
  };
}

// @ts-ignore
const startDate = GSTC.api.date().subtract(5, 'month').valueOf();

const items = {};
for (let i = 0; i < iterations; i++) {
  let rowId;
  let id = (rowId = i.toString());
  // @ts-ignore
  let startDayjs = GSTC.api
    .date(startDate)
    .startOf('day')
    .add(Math.floor(Math.random() * 365 * 2), 'days');
  items[id] = {
    id,
    label: 'item id ' + id,
    time: {
      start: startDayjs.valueOf(),
      end: startDayjs
        .clone()
        .add(Math.floor(Math.random() * 20) + 4, 'days')
        .endOf('day')
        .valueOf(),
    },
    progress: 50,
    rowId,
    lines: i > 0 && i % 2 === 0 ? [(i + 1).toString()] : [],
    style: { background: pallete[Math.floor(Math.random() * pallete.length)] },
  };
  if (Math.round(Math.random()))
    // @ts-ignore
    items[id].time.start = GSTC.api
      .date(items[id].time.start)
      .add(Math.round(Math.random() * 23), 'hour')
      .valueOf();
  // @ts-ignore
  items[id].label = GSTC.api.date(items[id].time.start).format('YYYY-MM-DD HH:mm');
}

const columns = {
  percent: 100,
  resizer: {
    inRealTime: true,
  },
  data: {
    id: {
      id: 'id',
      data: 'id',
      width: 50,
      header: {
        content: 'ID',
      },
    },
    label: {
      id: 'label',
      data: 'label',
      expander: true,
      isHTML: false,
      width: 230,
      header: {
        content: 'Label',
      },
    },
    progress: {
      id: 'progress',
      data: 'progress',
      width: 30,
      header: {
        content: '%',
      },
    },
  },
};

class ResizingItemClass {
  update(element, data) {
    const hasClass = element.classList.contains('resizing');
    if (data.item.isResizing && !hasClass) {
      element.classList.add('resizing');
    } else if (!data.item.isResizing && hasClass) {
      element.classList.remove('resizing');
    }
  }
}

let selectionApi;
const config = {
  plugins: [
    // @ts-ignore
    TimelinePointer.Plugin(),
    // @ts-ignore
    Selection.Plugin(),
    // @ts-ignore
    ItemMovement.Plugin(),
    // @ts-ignore
    CalendarScroll.Plugin(),
    // @ts-ignore
    HighlightWeekends.Plugin(),
  ],
  height: 423,
  list: {
    rows,
    columns,
  },
  scroll: {
    vertical: {
      smooth: true,
    },
  },
  chart: {
    items,
    time: {
      period: 'day',
      additionalSpaces: {
        hour: { before: 24, after: 24, period: 'hour' },
        day: { before: 10, after: 10, period: 'day' },
        week: { before: 1, after: 1, period: 'year' },
        month: { before: 6, after: 6, period: 'year' },
        year: { before: 12, after: 12, period: 'year' },
      },
    },
  },
  /*actions: {
          'chart-timeline-items-row-item': [ResizingItemClass]
        }*/
};

// @ts-ignore
let GSTCState = (window.state = GSTC.api.stateFromConfig(config));
/*GSTCState.subscribe('config.plugin.ItemMovement', itemMovement => {
        if (!itemMovement || !itemMovement.item) return;
        state.update(`config.chart.items.${itemMovement.item.id}.isResizing`, itemMovement.item.resizing);
      });*/

const element = document.getElementById('app');

function recenter() {
  gstc.api.scrollToTime(gstc.api.time.date().valueOf());
}

// @ts-ignore
element.addEventListener('gstc-loaded', (event) => {
  recenter();
});

// @ts-ignore
const gstc = GSTC({
  element,
  state: GSTCState,
});
// @ts-ignore
window.gstc = gstc; // debug

function changePeriod() {
  // @ts-ignore
  const period = document.getElementById('setperiod').value;
  // @ts-ignore
  const zoom = GSTC.api.setPeriod(period);
}

function destroy() {
  gstc.app.destroy();
}
gstc.state.subscribe('config.chart.time.period', (period) => {
  // @ts-ignore
  document.getElementById('setperiod').value = period;
});
gstc.state.subscribe('config.chart.time.zoom', (zoom) => {
  // @ts-ignore
  document.getElementById('zoom').value = zoom;
});

document.getElementById('percent').addEventListener('input', (ev) => {
  // @ts-ignore
  gstc.state.update('config.list.columns.percent', +ev.target.value);
});
document.getElementById('zoom').addEventListener('input', (ev) => {
  // @ts-ignore
  gstc.state.update('config.chart.time.zoom', +ev.target.value);
  // @ts-ignore
  const period = gstc.state.get('config.chart.time');
});

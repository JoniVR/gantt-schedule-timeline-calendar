/**
 * ListColumnRowExpander component
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */

import { Row, Vido } from '../../../gstc';

export interface Props {
  row: Row;
}

export default function ListColumnRowExpander(vido: Vido, props: Props) {
  const { api, state, onDestroy, Actions, update, html, createComponent, onChange } = vido;
  const componentName = 'list-column-row-expander';
  const componentActions = api.getActions(componentName);
  const actionProps = { ...props, api, state };
  let className = api.getClass(componentName);

  let ListColumnRowExpanderToggleComponent;
  const toggleUnsub = state.subscribe(
    'config.components.ListColumnRowExpanderToggle',
    (value) => (ListColumnRowExpanderToggleComponent = value)
  );

  const ListColumnRowExpanderToggle = createComponent(
    ListColumnRowExpanderToggleComponent,
    props.row ? { row: props.row } : {}
  );
  onDestroy(() => {
    ListColumnRowExpanderToggle.destroy();
    toggleUnsub();
  });

  let wrapper;
  onDestroy(state.subscribe('config.wrappers.ListColumnRowExpander', (value) => (wrapper = value)));

  const slots = api.generateSlots(componentName, vido, props);

  if (props.row) {
    function onPropsChange(changedProps) {
      props = changedProps;
      className = api.getClass(componentName, props.row.id);
      for (const prop in props) {
        actionProps[prop] = props[prop];
      }
      ListColumnRowExpanderToggle.change(props);
      slots.change(changedProps);
    }
    onChange(onPropsChange);
  }

  const actions = Actions.create(componentActions, actionProps);

  return (templateProps) =>
    wrapper(
      html`
        <div class=${className} data-action=${actions}>
          ${slots.html('before', templateProps)}${ListColumnRowExpanderToggle.html()}${slots.html(
            'after',
            templateProps
          )}
        </div>
      `,
      { vido, props, templateProps }
    );
}

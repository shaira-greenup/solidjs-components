import * as datepicker from "@zag-js/date-picker";
import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId, Index } from "solid-js";
import { Portal } from "solid-js/web";

export function DatePicker() {
  const service = useMachine(datepicker.machine, {
    id: createUniqueId(),
    onValueChange(details) {
      console.log("selected date:", details.valueAsString);
    },
  });

  const api = createMemo(() => datepicker.connect(service, normalizeProps));

  return {
    api,
    selectedDate: () => api().valueAsString,
    focus: () => {
      const inputEl = document.querySelector(
        '[data-part="input"]',
      ) as HTMLInputElement;
      if (inputEl) inputEl.focus();
    },
    open: () => api().setOpen(true),
    close: () => api().setOpen(false),
  };
}

export function DatePickerComponent() {
  const datePicker = DatePicker();
  const api = datePicker.api;

  return {
    component: (
      <>
        <div {...api().getControlProps()} class="flex gap-2 items-center w-fit">
          <input {...api().getInputProps()} class="datepicker-input w-40" />
          <button {...api().getTriggerProps()} class="datepicker-button">
            🗓
          </button>
        </div>

        <Portal>
          <div {...api().getPositionerProps()} class="z-50">
            <div {...api().getContentProps()} class="datepicker-popup">
              {/*  Day View  */}
              <div hidden={api().view !== "day"}>
                <div
                  {...api().getViewControlProps()}
                  class="flex justify-between items-center mb-4"
                >
                  <button
                    {...api().getPrevTriggerProps()}
                    class="datepicker-nav-button"
                  >
                    ‹
                  </button>
                  <button
                    {...api().getViewTriggerProps()}
                    class="datepicker-nav-button font-medium"
                  >
                    {api().visibleRangeText.start}
                  </button>
                  <button
                    {...api().getNextTriggerProps()}
                    class="datepicker-nav-button"
                  >
                    ›
                  </button>
                </div>

                <table {...api().getTableProps()} class="w-full">
                  <thead {...api().getTableHeaderProps()}>
                    <tr {...api().getTableBodyProps()}>
                      <Index each={api().weekDays}>
                        {(day) => (
                          <th
                            scope="col"
                            aria-label={day().long}
                            class="text-center text-sm font-medium p-2 text-[color:var(--color-base-content)]"
                          >
                            {day().narrow}
                          </th>
                        )}
                      </Index>
                    </tr>
                  </thead>
                  <tbody {...api().getTableBodyProps()}>
                    <Index each={api().weeks}>
                      {(week) => (
                        <tr {...api().getTableRowProps()}>
                          <Index each={week()}>
                            {(value) => (
                              <td
                                {...api().getDayTableCellProps({
                                  value: value(),
                                })}
                                class="text-center p-1"
                              >
                                <div
                                  {...api().getDayTableCellTriggerProps({
                                    value: value(),
                                  })}
                                  class="datepicker-cell w-8 h-8 flex items-center justify-center text-sm"
                                >
                                  {value().day}
                                </div>
                              </td>
                            )}
                          </Index>
                        </tr>
                      )}
                    </Index>
                  </tbody>
                </table>
              </div>

              {/*  Month View  */}
              <div hidden={api().view !== "month"}>
                <div
                  {...api().getViewControlProps({ view: "month" })}
                  class="flex justify-between items-center mb-4"
                >
                  <button
                    {...api().getPrevTriggerProps({ view: "month" })}
                    class="datepicker-nav-button"
                  >
                    ‹
                  </button>
                  <button
                    {...api().getViewTriggerProps({ view: "month" })}
                    class="datepicker-nav-button font-medium"
                  >
                    {api().visibleRange.start.year}
                  </button>
                  <button
                    {...api().getNextTriggerProps({ view: "month" })}
                    class="datepicker-nav-button"
                  >
                    ›
                  </button>
                </div>

                <table
                  {...api().getTableProps({ view: "month", columns: 4 })}
                  class="w-full"
                >
                  <tbody>
                    <Index
                      each={api().getMonthsGrid({
                        columns: 4,
                        format: "short",
                      })}
                    >
                      {(months) => (
                        <tr {...api().getTableBodyProps({ view: "month" })}>
                          <Index each={months()}>
                            {(month) => (
                              <td
                                {...api().getMonthTableCellProps(month())}
                                class="text-center p-1"
                              >
                                <div
                                  {...api().getMonthTableCellTriggerProps(
                                    month(),
                                  )}
                                  class="datepicker-cell px-3 py-2 text-sm"
                                >
                                  {month().label}
                                </div>
                              </td>
                            )}
                          </Index>
                        </tr>
                      )}
                    </Index>
                  </tbody>
                </table>
              </div>

              {/*  Year View  */}
              <div hidden={api().view !== "year"}>
                <div
                  {...api().getViewControlProps({ view: "year" })}
                  class="flex justify-between items-center mb-4"
                >
                  <button
                    {...api().getPrevTriggerProps({ view: "year" })}
                    class="datepicker-nav-button"
                  >
                    ‹
                  </button>
                  <span class="font-medium text-[color:var(--color-base-content)]">
                    {api().getDecade().start} - {api().getDecade().end}
                  </span>
                  <button
                    {...api().getNextTriggerProps({ view: "year" })}
                    class="datepicker-nav-button"
                  >
                    ›
                  </button>
                </div>

                <table
                  {...api().getTableProps({ view: "year", columns: 4 })}
                  class="w-full"
                >
                  <tbody>
                    <Index each={api().getYearsGrid({ columns: 4 })}>
                      {(years) => (
                        <tr {...api().getTableBodyProps({ view: "year" })}>
                          <Index each={years()}>
                            {(year) => (
                              <td
                                {...api().getYearTableCellProps({
                                  ...year(),
                                  columns: 4,
                                })}
                                class="text-center p-1"
                              >
                                <div
                                  {...api().getYearTableCellTriggerProps({
                                    ...year(),
                                    columns: 4,
                                  })}
                                  class="datepicker-cell px-3 py-2 text-sm"
                                >
                                  {year().label}
                                </div>
                              </td>
                            )}
                          </Index>
                        </tr>
                      )}
                    </Index>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Portal>
      </>
    ),
    selectedDate: datePicker.selectedDate,
    focus: datePicker.focus,
    open: datePicker.open,
    close: datePicker.close,
  };
}

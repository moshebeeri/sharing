import { Scheduler } from "@aldabil/react-scheduler";
import { EVENTS } from "./events";
import { Button } from "@mui/material";

export default function CustomCellAction() {
  return (
    <Scheduler
      events={EVENTS}
      view="week"
      day={null}
      month={null}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5],
        weekStartOn: 6,
        startHour: 9,
        endHour: 17,
        step: 60,
        cellRenderer: ({ height, start, onClick, ...props }) => {
          // Fake some condition up
          const hour = start.getHours();
          const disabled = hour === 14;
          const restProps = disabled ? {} : props;
          return (
            <Button
              style={{
                height: "100%",
                background: disabled ? "#eee" : "transparent",
                cursor: disabled ? "not-allowed" : "pointer"
              }}
              onClick={() => {
                if (disabled) {
                  return alert("Opss");
                }
                onClick();
              }}
              disableRipple={disabled}
              // disabled={disabled}
              {...restProps}
            ></Button>
          );
        }
      }}
    />
  );
}

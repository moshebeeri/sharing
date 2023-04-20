import { Scheduler } from "@aldabil/react-scheduler";
import { EVENTS } from "./events";
import type { EventActions, ProcessedEvent } from "@aldabil/react-scheduler/types"


const onConfirm = async (event: ProcessedEvent, action:EventActions): Promise<ProcessedEvent> => {
  console.log(JSON.stringify({ event, action }, null, 2));
  return event;
};

export default function EventsViewer() {

  return <Scheduler events={EVENTS} onConfirm={ onConfirm } />;
}

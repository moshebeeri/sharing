import { Fragment } from "react";
import { Button, Typography } from "@mui/material";
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { RESOURCES, EVENTS } from "./data";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

function SchedulersResourceView() {
  const { resourceViewMode, setResourceViewMode } = useScheduler();

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        <span>Resource View Mode: </span>
        <Button
          color={resourceViewMode === "default" ? "primary" : "inherit"}
          variant={resourceViewMode === "default" ? "contained" : "text"}
          size="small"
          onClick={() => setResourceViewMode("default")}
        >
          Default
        </Button>
        <Button
          color={resourceViewMode === "tabs" ? "primary" : "inherit"}
          variant={resourceViewMode === "tabs" ? "contained" : "text"}
          size="small"
          onClick={() => setResourceViewMode("tabs")}
        >
          Tabs
        </Button>
      </div>
      <Scheduler
        events={EVENTS}
        resources={RESOURCES}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          subTextField: "mobile",
          avatarField: "title",
          colorField: "color"
        }}
        fields={[
          {
            name: "admin_id",
            type: "select",
            default: RESOURCES[0].admin_id,
            options: RESOURCES.map((res) => {
              return {
                id: res.admin_id,
                text: `${res.title} (${res.mobile})`,
                value: res.admin_id //Should match "name" property
              };
            }),
            config: { label: "Assignee", required: true }
          }
        ]}
        // viewerExtraComponent={(fields, event) => {
        //   return (
        //     <div>
        //       {fields.map((field, i) => {
        //         if (field.name === "admin_id") {
        //           const admin = field.options.find(
        //             (fe) => fe.id === event.admin_id
        //           );
        //           return (
        //             <Typography
        //               key={i}
        //               style={{ display: "flex", alignItems: "center" }}
        //               color="textSecondary"
        //               variant="caption"
        //               noWrap
        //             >
        //               <PersonRoundedIcon /> {admin.text}
        //             </Typography>
        //           );
        //         } else {
        //           return "";
        //         }
        //       })}
        //     </div>
        //   );
        // }}
      />
    </Fragment>
  );
}

export default SchedulersResourceView;

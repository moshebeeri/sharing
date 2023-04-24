import React, { FC } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { CalendarEvent } from "./types";
const { contrastColor } = require('contrast-color');

interface EventItemProps {
  event: CalendarEvent;
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`;

interface EventIconProps {
  bgColor: string;
}

const EventIcon = styled("div")<EventIconProps>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "currentColor"};
`;

const getContrastingTextColor = (color: string): string => {
  // const rgbaColor = rgba(color);
  // return readableColor(rgbaColor);
  return contrastColor({ bgColor: color });

  //return color;
};


const EventItem: FC<EventItemProps> = ({ event }) => {
  const textColor = getContrastingTextColor(event.color || "#ffffff");

  return (
    <StyledCard elevation={1}>
      <CardHeader
        avatar={<EventIcon bgColor={textColor}  />}
        title={<Typography variant="subtitle1" style={{ color: textColor }}>{event.title}</Typography>}
        subheader={
          <Typography variant="caption" style={{ color: textColor }}>
            {`${event.start.toLocaleDateString()} ${event.start.toLocaleTimeString()} - ${event.end.toLocaleDateString()} ${event.end.toLocaleTimeString()}`}
          </Typography>
        }
        style={{ backgroundColor: event.color || "#ffffff" }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {/* You can add more information about the event here */}
          Event details
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default EventItem;

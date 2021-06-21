// @ts-check
import React, { useMemo } from "react";
import { getAvatarByUserAndRoomId } from "../../../../../utils";
import ChatIcon from "./ChatIcon";

const AvatarImage = ({ name, id }) => {
  const url = useMemo(() => {
    if (!name) {
      return `https://robohash.org/${id}.png?set=set4`
    } else if (['Dev', 'Backend', 'Frontend'].includes(name)) {
      return `https://robohash.org/${name}.png?set=set3`
    } else {
      return `https://robohash.org/${name}.png`
    }
  }, [id, name]);

  return (
    <>
      {name !== "General" ? (
        <img
          src={url}
          alt={name}
          style={{ width: 32, height: 32, objectFit: "cover" }}
          className="rounded-circle avatar-xs"
        />
      ) : (
        <div className="overflow-hidden rounded-circle">
          <ChatIcon />
        </div>
      )}
    </>
  );
};

export default AvatarImage;

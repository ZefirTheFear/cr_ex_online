import React from "react";
import { useSession } from "next-auth/react";

import classes from "./Profile.module.scss";

const Profile: React.FC = () => {
  const { data: session } = useSession();
  if (!session) {
    return null;
  }

  return (
    <div className={classes.profile}>
      <div className={classes.profile__inner}>
        <h2 className={classes.profile__heading}>My profile</h2>
        <div className={classes["profile__user-data"]}>user data</div>
        <span>{session.user.phone}</span>
        <span>{session.user.name}</span>
      </div>
    </div>
  );
};

export default Profile;

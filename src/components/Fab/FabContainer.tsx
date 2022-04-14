import classes from "./FabContainer.module.scss";
import ReloadGameFab from "./ReloadGameFab";
import SettingsFab from "./Settings/SettingsFab";

const FabContainer = () => (
    <div className={classes.root}>
        <ReloadGameFab />
        <SettingsFab />
    </div>
);

export default FabContainer;

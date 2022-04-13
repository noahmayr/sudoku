import classes from "./FabContainer.module.scss";
import SettingsFab from "./Settings/SettingsFab";

const FabContainer = () => (
    <div className={classes.root}>
        <SettingsFab />
    </div>
);

export default FabContainer;

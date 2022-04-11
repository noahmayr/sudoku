import { useSelector } from "react-redux";
import { selectSettings, SettingsMenu } from "../../state/slice/settings";
import Group from "./Group";
import classes from "./Sidebar.module.scss";

const Sidebar = () => {
    const settings = useSelector(selectSettings);

    return (
        <div className={classes.root}>
            <Group group={SettingsMenu} state={settings} />
        </div>
    );
};

export default Sidebar;

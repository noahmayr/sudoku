import {
    Button, Dialog, DialogActions, DialogContent, Fab,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectSettings, SettingsMenu } from "../../../state/slice/settings";
import { useSuppressAction } from "../../../state/middleware/suppressAction";
import Group from "./Group";

const SettingsFab = () => {
    const settings = useSelector(selectSettings);
    const [open, setOpen] = useState(false);

    useSuppressAction((action) => open && !action.type.startsWith("settings"), [open]);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab color="primary" size="large" onClick={() => setOpen(true)}><SettingsIcon fontSize="large" /></Fab>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogContent>
                    <Group group={SettingsMenu} state={settings} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SettingsFab;

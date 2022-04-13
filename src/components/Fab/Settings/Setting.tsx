import {
    FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch,
} from "@mui/material";
import { settingsActions } from "../../../state/slice/settings";
import { useAppDispatch } from "../../../state/store";
import { AnyOption, OptionGroupValue, OptionTypes } from "../../../state/util/options";

interface SettingProps<T extends AnyOption> {
    option: T;
    state: OptionGroupValue<T>;
    path: string;
}

export default function Setting<T extends AnyOption>({ option, path, state }: SettingProps<T>) {
    const dispatch = useAppDispatch();
    const changeSetting = (value: unknown) => {
        dispatch(settingsActions.change(
            {
                path,
                value,
            },
        ));
    };

    switch (option.display) {
        case "checkbox":
            return (
                <FormControl fullWidth variant="standard">
                    <FormControlLabel label={option.title} labelPlacement="end" control={
                        <Switch
                            checked={state}
                            onChange={event => changeSetting(event.target.checked)}
                        />
                    } />
                </FormControl>
            );
        case "select":
            return (
                <FormControl fullWidth variant="outlined">
                    <InputLabel id={path}>{option.title}</InputLabel>
                    <Select
                        labelId={path}
                        label={option.title}
                        value={state}
                        onChange={event => changeSetting(event.target.value)}
                    >
                        {option.options.map((opt: OptionTypes) => (
                            <MenuItem key={opt.toString()} value={opt.toString()}>
                                {opt.toString()}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            );
        default:
            return null;
    }
}

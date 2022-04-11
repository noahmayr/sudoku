import { settingsActions } from "../../state/slice/settings";
import { useAppDispatch } from "../../state/store";
import { AnyOption, OptionGroupValue, OptionTypes } from "../../state/util/options";
import classes from "./Setting.module.scss";

interface SettingProps<T extends AnyOption> {
    option: T;
    state: OptionGroupValue<T>;
    path: string;
}

const InputRenderer = <T extends AnyOption>({ option, state, path }: SettingProps<T>) => {
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
                <input type="checkbox" checked={state} onChange={event => changeSetting(event.target.checked)} />
            );
        case "select":
            return (
                <select value={state} onChange={event => changeSetting(event.target.value)}>
                    {option.options.map((opt: OptionTypes) => (
                        <option
                            key={opt.toString()}
                            value={opt.toString()}
                        >{opt.toString()}</option>
                    ))}
                </select>
            );
        default:
            return null;
    }
};

export default function Setting<T extends AnyOption>(props: SettingProps<T>) {
    return (
        <label className={classes.root}>
            <span>{props.option.title}</span>
            <InputRenderer {...props} />
        </label>
    );
}

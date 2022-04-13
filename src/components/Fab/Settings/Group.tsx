import Setting from "./Setting";
import classes from "./Group.module.scss";
import { AnyOption, AnyOptionGroup, AnyOptionOrGroup, OptionGroupValue } from "../../../state/util/options";

type OptionMapCallback = (
    key: string,
    option: AnyOptionOrGroup,
    state: OptionGroupValue<typeof option>
) => unknown;

function mapOptionGroup(
    group: AnyOptionGroup,
    state: OptionGroupValue<typeof group>,
    callback: OptionMapCallback,
) {
    const keys = Object.keys(group.options) as KeyOf<typeof group["options"]>[];
    return keys.map(key => {
        const option = group.options[key];
        const optionState = state[key];
        return callback(key, option, optionState);
    });
}

const isOption = (option: AnyOptionOrGroup): option is AnyOption => Object.prototype.hasOwnProperty.call(option, "value");

interface OptionGroupProps<T extends AnyOptionGroup> {
    group: T;
    state: OptionGroupValue<T>;
    path?: string;
}

export default function Group<T extends AnyOptionGroup>(
    { group, state, path }: OptionGroupProps<T>,
) {
    const depth = Math.min((path?.split(".").length ?? 0) + 1, 6);
    const HeadingTag = `h${depth}` as keyof JSX.IntrinsicElements;

    return (
        <div className={classes.root}>
            <HeadingTag>{group.title}</HeadingTag>
            {mapOptionGroup(group, state, (key, option: AnyOptionOrGroup, optionState) => {
                const nextPath = path === undefined ? key : [path, key].join(".");
                if (isOption(option)) {
                    return (
                        <Setting key={key} path={nextPath} option={option} state={optionState} />
                    );
                }
                return (
                    <Group key={key} path={nextPath} group={option} state={optionState} />
                );
            })}
        </div>
    );
}

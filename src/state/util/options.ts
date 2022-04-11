export type OptionTypes = string|boolean;

export interface Option<V extends OptionTypes, O extends ReadonlyArray<V>> {
    title: string;
    options: O;
    value: ValueOf<O>;
    display: "checkbox"|"select"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyOption = Option<any, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface OptionGroup<T extends Record<string, AnyOption|OptionGroup<any>>> {
    title: string;
    options: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyOptionGroup = OptionGroup<Record<string, AnyOption|AnyOptionGroup>>;
export type AnyOptionOrGroup = AnyOption|AnyOptionGroup;

type OptionByName<G extends AnyOptionGroup, K extends keyof G["options"]> = G["options"][K];

export type OptionsPath<G extends AnyOptionGroup, Path extends string> =
    Path extends keyof G["options"]
        ? OptionByName<G, Path>
        : (Path extends `${infer Key}.${infer Rest}`
            ? (Key extends keyof G["options"] ? OptionsPath<OptionByName<G, Key>, Rest> : never)
            : never);

export type OptionValue<O extends AnyOption> = ValueOf<O["options"]>;

export type OptionGroupValue<G extends AnyOptionOrGroup> =
        G extends AnyOption
        ? OptionValue<G>
        : {[key in keyof G["options"]]: OptionGroupValue<G["options"][key]>};

export const option = <V extends OptionTypes, O extends ReadonlyArray<V>>(
    title: string,
    options: O,
    value: ValueOf<O>,
    display: AnyOption["display"],
): Option<V, O> => {
    return {
        title, options, value, display,
    };
};

export const optionGroup = <T extends Record<string, AnyOptionOrGroup>>(
    title: string,
    options: OptionGroup<T>["options"],
): OptionGroup<T> => {
    return {
        title,
        options,
    };
};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Draft } from "immer";
import merge from "lodash/merge";
import { RootState } from "../store";
import {
    AnyOption, AnyOptionGroup, option, optionGroup, OptionGroupValue, OptionsPath, OptionValue,
} from "../util/options";

const OPT = {
    theme: ["light", "dark"],
    validation: ["cell", "region", "both", "none"],
    yesno: [true, false],
} as const;

export const SettingsMenu = optionGroup("Settings", {
    theme: option("Theme", OPT.theme, "light", "select"),
    validation: optionGroup("Validation", {
        errors: option("Show Highlighting for Errors", OPT.validation, "both", "select"),
        warnings: option("Show Highlighting for Warnings", OPT.validation, "both", "select"),
        success: option("Show Highlighting when solved correctly", OPT.yesno, true, "checkbox"),
    }),
});

type Settings = OptionGroupValue<typeof SettingsMenu>;

const DEFAULT_SETTINGS: Settings = {
    theme: "light",
    validation: {
        errors: "both",
        warnings: "both",
        success: true,
    },
};

type SettingsPayload = Partial<Settings>


type ValueForPath<G extends AnyOptionGroup, T extends string> = OptionsPath<G, T> extends AnyOption
? OptionValue<OptionsPath<G, T>>
: never;


interface ChangePayload<T extends string> {
    path: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
}

const setValueAt = <G extends AnyOptionGroup, T extends string>(
    draft: Draft<OptionGroupValue<G>>,
    path: T,
    value: ValueForPath<G, T>,
) => {
    const [current, ...rest] = path.split(".");
    if (!Object.prototype.hasOwnProperty.call(draft, current)) {
        throw Error(`failed to find ${current} in ${JSON.stringify(draft)}`);
    }
    if (rest.length) {
        setValueAt(draft[current as keyof typeof draft], rest.join("."), value);
        return;
    }
    draft[current as keyof typeof draft] = value;
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState: DEFAULT_SETTINGS,
    reducers: {
        configure: (draft, { payload }: PayloadAction<SettingsPayload>) => {
            merge(draft, payload);
        },
        change: <T extends string>(
            draft: Draft<Settings>,
            { payload }: PayloadAction<ChangePayload<T>>,
        ) => {
            setValueAt(draft, payload.path, payload.value);
        },
    },
});

export const settingsActions = settingsSlice.actions;

export default settingsSlice.reducer;

export const selectSettings = (state: RootState) => state.settings;

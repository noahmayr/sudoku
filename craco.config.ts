import { CracoConfig } from "@craco/craco";

export default (): CracoConfig => {
    return { webpack: { configure: { resolve: { fallback: { buffer: false } } } } };
};

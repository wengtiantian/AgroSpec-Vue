
export function createAsyncComponent(loader) {
    let component = null

    return () => {
        if (!component) {
            return loader().then(c => {
                component = c
                return component
            })
        } else {
            return Promise.resolve(component)
        }
    }
}

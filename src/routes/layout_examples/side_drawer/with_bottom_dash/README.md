# Side Drawer With Bottom Dash

This is fundamentally the same as ../side_drawer_polished.tsx with the addition of a bottom dash for mobile devices. This can be helpful for a quick access menu to toggle the sidebar etc.

## Context Providers

### overview
#### Implementation

In the Layout component, signals and stores are created:


```tsx
function Layout(props: LayoutProps) {

  const [isDev, setIsDev] = createSignal(false);
  const [layoutState, setLayoutState] = createStore<LayoutState>({
    drawer: {
      width: 256, // Default 256px (w-64)
      visible: false,
  // ...
  // ...
  // ...


```

These are used to create a `contextValue` variable:


```tsx
// The type of the context
interface LayoutContextValue {
  layoutState: LayoutState;
  setLayoutState: SetStoreFunction<LayoutState>;
  isDev: () => boolean;
  setIsDev: (value: boolean) => void;
  minWidth: number;
  maxWidth: number;
}

// The context Variable
const LayoutContext = createContext<LayoutContextValue>();


// The function
function Layout(props: LayoutProps) {
    // ...
    // Set up signals etc.
    // ...
    // ...
    // ...


    // Create the `contextValue`
  const contextValue: LayoutContextValue = {
    layoutState,
    setLayoutState,
    isDev,
    setIsDev,
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
  };

  // Pass the context to the children

  return (
    <LayoutContext.Provider value={contextValue}>
      <div class={props.class}>
        {props.children}
      </div>
    </LayoutContext.Provider>
  );
}

```


#### Usage from External Library
Now any child of of Layout can access these as a global variable, e.g.:


```tsx

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a Layout component");
  }
  return context;
}

export default function Home() {
  // Extract the keys by name with `{ }`
  const { layoutState, setLayoutState, isDev, setIsDev } = useLayoutContext();
  return (
    <main class="h-screen flex flex-col">
      <div>
          <Show when={isDev()}>
            <p>In Development Mode</p>
          </Show>
      </div>
    </main>
}

```

### Reasoning Through Code

Say the user needs to find where the `layoutState` variable used in the `<Navbar` came from in the following code:

```tsx

// Wrapper components that pass context to the views
function NavbarWrapper() {

  return (
  );
}

export default function Home() {
  const context: LayoutContextValue = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within a Layout component");
  }
  const { layoutState, setLayoutState, isDev, setIsDev } = context();

  return (
    <main class="h-screen flex flex-col">
      <Layout>
        <Layout.Navbar>
            <NavbarContentView
              layoutState={layoutState}
              setLayoutState={setLayoutState}
              isDev={isDev}
              setIsDev={setIsDev}
            />
        </Layout.Navbar>
      </Layout>
    </main>
  )
}

```

> [!NOTE]
> The developer will need to find the `LayoutContext.Provider` in the `Layout` definition. This is what passes those variables down to the children, so this is where they can be found. LSP References (`vim.lsp.buf.references()`) on `LayoutContext` will help, just grep `rg -i layout.*provider` or `SPC / ayout.*rovider`.


Many library will have a getter for `context: LayoutContextValue`, the following in
The process goes:

1. `gd` on layout State in:

    ```tsx
        <NavbarContentView
          layoutState={layoutState}
    ```

    This takes us too:

    ```tsx
      const { layoutState, setLayoutState, isDev, setIsDev } = useLayoutContext();
    ```


2. `gd` on `useLayoutContext()`, taking us to the library in `index.tsx`:

   ```tsx
   export function useLayoutContext() {
     const context = useContext(LayoutContext);
     if (!context) {
       throw new Error("useLayoutContext must be used within a Layout component");
     }
     return context;
   }

   ```


3. We are interested in the `LayoutContext: Context<LayoutContextValue>` variable (as `createContext` is a built-in), this should take us to something at the root of the library:

    ```tsx
    const LayoutContext = createContext<LayoutContextValue>();
    ```

4. From here if we `:lua vim.lsp.buf.references()` on the `LayoutContext` variable we should see it used in three places:


    1. Instatiation (Create)
        ```tsx
        const LayoutContext = createContext<LayoutContextValue>();
        ```
    2. Getter (Read)
        ```tsx
        const context = useContext(LayoutContext);
        ```
    3. Provider
        ```tsx
        function Layout() {
              // ...
          return (
            <LayoutContext.Provider value={contextValue}>
              {/* ... */}
              {/* ... */}
            </LayoutContext.Provider>
          )
        }

        ```



can hopefully find the location in `<Layout` where this is passed to the context provider.


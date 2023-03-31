# Plugin System

The Collection Manager has a plugin system which allows you add custom
functionality to your deployment.

Currently, all plugins are collection-level and, when enabled, are exposed on
the "Add-ons" tab of the Collection page.


## Configuring Plugins

The following directories are scanned for plugins:

1. `src/plugins/default`
2. `src/plugins/external`

All plugins found in either folder will be enabled on the UI.


## Default Plugins

### `import`: Data import

This plugin enables users to upload a CSV file from which to create a schema and
any number of templates. See [`plugin-import.md`](plugin-import.md) for
additional details.


## External Plugins

To add external plugins, simply add them to the `src/plugins/external` folder.

They will be detected automatically upon restarting the app.

It is recommended to use remote git repos, but the only requirement is that
the plugins follow the rules outlined in the "Creating a Plugin" section below.


### Installing the "Hello World" plugin

`hello` is an example of a minimal plugin which can be cloned and adapted for
your needs.

Navigate to the `plugins` dir and `git clone` the plugin repository:

```
cd src/plugins/external
git clone https://github.com/FACINGS/hello-plugin.git
```

After restarting the app, you will see "Hello" in the Collection Add-ons tab.




## Creating a Plugin

All plugins are required to have an `index.tsx` file located at
`src/plugins/<plugin-name>/index.tsx`.

There are no strict requirements for `<plugin-name>` but it is recommended to
keep them as simple as possible and avoid spaces.

The most basic plugin might look something like this:

```
export default function Hello() {
  return (
    <div className="container pb-8">
      <div className="flex flex-col">
        <h1
          style={{
            fontSize: '160px',
            fontWeight: 'bold',
            lineHeight: 'initial',
          }}
        >
          Hello
        </h1>
        <h3 style={{ fontSize: '40px', lineHeight: 'initial' }}>
          I'm a Plugin Demonstration
        </h3>
      </div>
    </div>
  );
}
```


## Contributing Plugins

We welcome all merge requests for plugins which extend the functionality of the
app.

See [CONTRIBUTING.md](../CONTRIBUTING.md) for more information about creating
merge requests for collection-manager.

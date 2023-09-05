# Import Plugin

The Data Import plugin allows users to batch-create a single schema and any
number of templates by starting with a basic spreadsheet and adding a data
formatting pattern.

The benefits of this approach:

1. **Speed**: Schemas and templates do not have to be created one-at-a-time,
   thus making it much faster to launch collections
2. **Accuracy**: The use of a spreadsheet app allows for easier bulk editing
   when preparing a collection, and automated imports remove the possibility
   of manual data entry errors.
3. **Automation**: By using a portable file format (CSV), schema/template
   definitions can also be created programmatically, and/or passed through
   any number of intermediate tools/apps.
4. **Integrity**: Optional "validator hints" provided by the plugin can help
   catch mistakes such as empty or non-unique entries before the schema and
   templates are created.

## Step 1: Preparing the Spreadsheet

To start, we assume you have a spreadsheet where the first row contains
desired schema attribute names, and each successive row is a template
to be created.

It is recommended that (at the very least) you include a `name` and `img` field.

##### Example: `fruits.csv`

This spreadsheet consists of 4 columns and 5 rows, from which 1 schema and 4
templates will be created.

| name   | img                                                         | points | description         |
| ------ | ----------------------------------------------------------- | ------ | ------------------- |
| Apple  | QmY2yFqDmSPWiFbzsMeREHXyCkY5LdY62WWyYUhe5ogpmT              | 5      | Crunchy round fruit |
| Banana | bafkreidullbimqjiob2apauxv3tj23kupb5em3c4i5soks2svsbqrvasce | 2      | Mushy yellow fruit  |
| Kiwi   | bafkreichwf6uollkwe55bmrvnt3744rnmn5g3boekoh62krgu2umv4qpgu | 3      | Hairy green fruit   |
| Cherry | QmeciM9AtHdCycNAwtWh6bAsLCaKnWjgFAg95pFuP63AGW              | 8      | Red stone fruit     |

## Step 2: Add system columns

There are 4 columns that **must be present** when importing a CSV file:

1. `max_supply`: (whole number) the maximum number of NFTs which can be minted
   from the template. (set to `0` for _unlimited_)
2. `burnable`: (`TRUE` or `FALSE`) recommended set to `TRUE` to allow
   users the option to burn their NFTs.
3. `transferable`: (`TRUE` or `FALSE`) recommended set to `TRUE` to allow users
   to trade their NFTs.
4. `sysflag`: leave this column blank for now.

##### Example:

Note: ❌ indicates cells which are to be left blank.

| name   | img                                                         | points | description         | **max_supply** | **burnable** | **transferable** | **sysflag** |
| ------ | ----------------------------------------------------------- | ------ | ------------------- | :------------: | :----------: | :--------------: | :---------: |
| Apple  | QmY2yFqDmSPWiFbzsMeREHXyCkY5LdY62WWyYUhe5ogpmT              | 5      | Crunchy round fruit |    **100**     |   **TRUE**   |     **TRUE**     |     ❌      |
| Banana | bafkreidullbimqjiob2apauxv3tj23kupb5em3c4i5soks2svsbqrvasce | 2      | Mushy yellow fruit  |    **100**     |   **TRUE**   |     **TRUE**     |     ❌      |
| Kiwi   | bafkreichwf6uollkwe55bmrvnt3744rnmn5g3boekoh62krgu2umv4qpgu | 3      | Hairy green fruit   |    **100**     |   **TRUE**   |     **TRUE**     |     ❌      |
| Cherry | QmeciM9AtHdCycNAwtWh6bAsLCaKnWjgFAg95pFuP63AGW              | 8      | Red stone fruit     |    **100**     |   **TRUE**   |     **TRUE**     |     ❌      |

## Step 3: Specify data types

1. Insert a single row between rows 1 and 2.
2. In the `sysflag` column, enter `datatype`.
3. For each of your original columns, enter the desired datatype in this row (ignore `max_supply`, `burnable`, and `transferable`).

Example data types:

1. `string`: any text content
2. `uint8`: whole numbers from `0` to `255`
3. `int16`: whole numbers from `-32,768` to `32,767`
4. `float`: decimal numbers
5. `image`: IPFS image hash or URL
6. `ipfs`: IPFS file hash or URL
7. `bool`: boolean values: `TRUE` or `FALSE`

For a full list of allowed types, see [Data Types](data-types.md).

##### Example

Note: ❌ indicates cells which are to be left blank.

| name       | img                                                         | points    | description         | max_supply | burnable | transferable |   sysflag    |
| ---------- | ----------------------------------------------------------- | --------- | ------------------- | :--------: | :------: | :----------: | :----------: |
| **string** | **image**                                                   | **uint8** | **string**          |     ❌     |    ❌    |      ❌      | **datatype** |
| Apple      | QmY2yFqDmSPWiFbzsMeREHXyCkY5LdY62WWyYUhe5ogpmT              | 5         | Crunchy round fruit |    100     |   TRUE   |     TRUE     |      ❌      |
| Banana     | bafkreidullbimqjiob2apauxv3tj23kupb5em3c4i5soks2svsbqrvasce | 2         | Mushy yellow fruit  |    100     |   TRUE   |     TRUE     |      ❌      |
| Kiwi       | bafkreichwf6uollkwe55bmrvnt3744rnmn5g3boekoh62krgu2umv4qpgu | 3         | Hairy green fruit   |    100     |   TRUE   |     TRUE     |      ❌      |
| Cherry     | QmeciM9AtHdCycNAwtWh6bAsLCaKnWjgFAg95pFuP63AGW              | 8         | Red stone fruit     |    100     |   TRUE   |     TRUE     |      ❌      |

## Step 4: (Optional) Additional properties and validators

### Properties

- `mutable`: `TRUE`, `FALSE` - if set to `TRUE` for a column, this field
  **will not** be added to the template. By default, all fields are assumed to
  be immutable. If `mutable` is not added, all data will be considered
  immutable.

### Validators

Validators are optional but recommended as they will help you capture any
potential issues or mistakes in your data (e.g. missing or repeated values).
Any failed validations will be reported by the Importer _before_ anything is
written to the blockchain.
Futute validators may include features like "spellcheck".

- `required`: `TRUE` or `FALSE` - if set to `TRUE`, the data import will fail
  if any values for this field are blank.
- `unique`: `TRUE` or `FALSE` - if set to `TRUE`, the data import will verify
  that all templates to be created have no duplicate values for this field.

### How to add a _Property_ or _Validator_

The process of adding _properties_ or _validators_ is similar to adding the
required `datatype` _sysflag_:

1. Insert a new header row (e.g. after the `datatype` row but before the
   templates start. in the example below, two validators were added).
2. Enter the desired values, ignoring `max_supply`, `burnable`, and `transferable`.

##### Example

At this point, the spreadsheet will look something like this:

Note: ❌ indicates cells which are to be left blank.

| name     | img                                                         | points    | description         | max_supply | burnable | transferable |   sysflag    |
| -------- | ----------------------------------------------------------- | --------- | ------------------- | :--------: | :------: | :----------: | :----------: |
| string   | image                                                       | uint8     | string              |     ❌     |    ❌    |      ❌      |   datatype   |
| **TRUE** | **TRUE**                                                    | **TRUE**  | **TRUE**            |     ❌     |    ❌    |      ❌      | **required** |
| **TRUE** | **TRUE**                                                    | **FALSE** | **TRUE**            |     ❌     |    ❌    |      ❌      |  **unique**  |
| Apple    | QmY2yFqDmSPWiFbzsMeREHXyCkY5LdY62WWyYUhe5ogpmT              | 5         | Crunchy round fruit |    100     |   TRUE   |     TRUE     |      ❌      |
| Banana   | bafkreidullbimqjiob2apauxv3tj23kupb5em3c4i5soks2svsbqrvasce | 2         | Mushy yellow fruit  |    100     |   TRUE   |     TRUE     |      ❌      |
| Kiwi     | bafkreichwf6uollkwe55bmrvnt3744rnmn5g3boekoh62krgu2umv4qpgu | 3         | Hairy green fruit   |    100     |   TRUE   |     TRUE     |      ❌      |
| Cherry   | QmeciM9AtHdCycNAwtWh6bAsLCaKnWjgFAg95pFuP63AGW              | 8         | Red stone fruit     |    100     |   TRUE   |     TRUE     |      ❌      |

## Step 5: Export to CSV

The **file name will determine schema name**. For example, `fruits.csv` would
create a schema named `fruits`.

##### Example

Exported to **[fruits.csv](plugin-import-sample/fruits.csv)**:

```
name,img,points,description,max_supply,burnable,transferable,sysflag
string,image,uint8,string,,,,datatype
TRUE,TRUE,TRUE,TRUE,,,,required
TRUE,TRUE,FALSE,TRUE,,,,unique
Apple,QmY2yFqDmSPWiFbzsMeREHXyCkY5LdY62WWyYUhe5ogpmT,5,Crunchy round fruit,100,TRUE,TRUE,
Banana,bafkreidullbimqjiob2apauxv3tj23kupb5em3c4i5soks2svsbqrvasce,2,Mushy yellow fruit,100,TRUE,TRUE,
Kiwi,bafkreichwf6uollkwe55bmrvnt3744rnmn5g3boekoh62krgu2umv4qpgu,3,Hairy green fruit,100,TRUE,TRUE,
Cherry,QmeciM9AtHdCycNAwtWh6bAsLCaKnWjgFAg95pFuP63AGW,8,Red stone fruit,100,TRUE,TRUE,
```

This CSV file can now be uploaded in the UI.

## Step 6: Upload to Data Import

1. In the app, navigate to your collection and click the "Plugins" tab.
2. Click "Import" to bring up the data import form.
3. Click "Select File" and use the CSV file you saved in the last step.

If there are any data or validation errors, the app will let you know which line numbers triggered the errors and what needs to be done to fix them.

If there were no errors detected, you will be asked to sign the transactions for creating the shema and templates.

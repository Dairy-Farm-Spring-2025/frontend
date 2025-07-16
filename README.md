# 🐮🏡 DFMS - Dairy Farm Management System

## ℹ️ Introduction

The dairy farm management system is a web-based and mobile application to simplify and optimize dairy farm operations.
The system provides functions for managing cows, health records, diseases, areas, feed meals, vaccines, vaccine cycles,
storage, and daily tasks.

## 🚀 Key features

- **Cow management**: Manage information of cow includes: General information, Qr of cow ,health record, disease, milking, history of pen. Create new cow, import the bulk of cow and move the bulk cow to pens.
- **Area management**: Manage information of area includes: General information and pen
- **Vaccine management**: Manage vaccine cycle and vaccine injection, create a vaccine injection process for cow.
- **Storage management**: Manage the storage, category, item, export item, item batch and suppliers
- **Task management**: Manage the task of worker and veterinarian includes: create task, import tasks, review tasks for worker/veterinarian. Worker/Veterinarian do the task then update the status of task.

# 📌 Main features:

## 💻 Web application with admin role:

- User management (Create new user, ban user)
- Dashboard
- View dairy farm (cow, cow type, vaccine,...) list
- View storage
- View task

## 💻 Web application with manager role:

- Cow management (Create new cow, import cow, move cows to pens, ...)
- Vaccine management (Create new vaccine cycle, view list of vaccine injection)
- Area management (Create new area)
- Storage management (Create new storage, category, item, item batch and supplier)
- Task management (Create task, import task, review and check task)

## 📱 Mobile application with veterinarian role:

- View dairy information (cow, cow type,...)
- Vaccine management (Create new vaccine cycle, create vaccine injection)
- Health record (Update health record, Check daily health record and update the disease status of cow)
- Check out task

## 📱 Mobile application with worker role:

- View dairy information
- Do the daily task (Update status of task, export the item need to this task)
- Raise the issue for cow if needed (Create the report disease cow)
- Check out task

# 📚 Tech Stack

| 🚀 Technology      | 📝 Description                          |
|--------------------|-----------------------------------------|
| **Frontend**       | ReactJS + Vite + TypeScript             |
| **UI Library**     | Antd                                   |
| **API Call**       | Axios + SWR                            |
| **State Management** | Redux / Redux Toolkit + Redux Persist |
| **Style Library**  | Tailwind, SCSS                         |
| **Multi-language** | i18n                                   |
| **Other**          | Firebase, xyflow, dayjs,...             |

# 📖 Installation

## 🌐 Frontend

```bash
# Clone project
git clone https://github.com/Dairy-Farm-Spring-2025/frontend.git

# Directory
cd frontend

# Install dependency
npm install

# Run the application
npm run dev

# Build the application
npm run build
```

# Welcome to DFMS Project--

# 📜 Frontend development rules

- Using general components (like button, table, modal,...) from folder components
- Split components in a big component to manage folder code
- Using format in utils to format date or format enum from api

# 📁 Folder Structure

- ├─public/
- │ ├─i18n # Language transfer data of i18n
- │ ├─firebase-messaging-sw.js # Config firebase for push notification
- ├─src/
- │ ├─common # Static value like primary color,...
- │ ├──components # Reusable components and ui
- │ ├──config # Config axios, i18n and other (if have)
- │ │ ├─axios # Config axios with interceptors, handle refresh token call api
- │ │ ├─i18n # Config i18n for multi-languages
- │ │ └─routes # Routes of websites
- │ ├─core # Layout and Store
- │ │ ├─layout # General layout of websites includes header (username and dropdown action includes profile, logout ), sidebar (items for navigate to another pages) and content (for render content of pages)
- │ │ └─store # State management config using redux toolkit + redux persist and contain slice too
- │ ├─hooks # Custom hook
- │ ├─pages # Contain pages ui of websites
- │ ├─service # Contain api and data for service
- │ │ ├─api # Path of api (using with swr custom hook for call api action)
- │ │ └─data # Static data or enum such as Status, Type,... for options in select (For example)
- │ ├─model # Typescript interface
- │ ├─styles # General and reusable style by using Scss
- │ └─utils # Reusable function such as format, validate or status render

# 🔁 Flow Call API Tutorial

- [x] Define Path of API in service/api
      **_Example of define path_**

```js
export const COW_PATH = {
  COWS: 'cows',
  COW_DETAIL: (id: string) => `cows/${id}`,
};
```

- [x] Method Call
-       ├─GET: Call with data, mutate (Mutate will refetch api get when do action method) with method 'GET'

**_Example of call api GET method_**

```js
const {
    data,
    error,
    isLoading,
    mutate: mutateCows,
  } = useFetcher<Cow[]>(COW_PATH.COWS, 'GET');
```

-      └─Action Method (POST, PUT, DELETE): Call with trigger for do action of this api with method action

**_Example of call action api method_**

```js
const { trigger, isLoading } = useFetcher(COW_PATH.COW_CREATE_SINGLE, 'POST');
const handleFinish = async (values: any) => {
  ...
        const response = await trigger({ body: payload }); /// This is call API Post after handle form
  ...
}
```

# ♻️ How to use important component reusable

## TableComponent

- 1. Define columns for table (dataIndex, key, title is required)
  - dataIndex is important, it will be match with property (such as data.name, dataIndex is name)
  - key is define for unique of column
  - title is header of column
  - render is handle render of that column element if it is complicated
  - sorter will enable the sort for column
  - filterable and filterOptions if need to filter base on select
  - filterDate will enable filter by date
- 2. Call table with column and dataSource is required props
     **_For example_**

```jsx
const columns: Column[] = [
  {
    dataIndex: 'name',
    key: 'name',
    title: t('Name'),
    render: (element: string, data) => (
      <TextLink
        to={`/dairy/cow-management/${data.cowId}`}
        className="!text-base font-bold"
      >
        {element}
      </TextLink>
    ),
    searchText: true,
  },
  ...
];
return (
  <TableComponent
    loading={isLoading}
    columns={columns}
    dataSource={data ? formatSTT(data) : []}
  />
);
```

## ModalComponent

- 1. open is required to handle state status of modal (open or close)
  - Modal will have 2 default action (onOk, onCancel), can be replaced by using footer props
  - Have disabledButtonOk if you don't want allow click Confirm if it's condition
- 2. Using useModal custom hook to easy handle state of modal
     **_For example_**

```jsx
/// ModalCreateUser.tsx
const ModalCreateUser = ({ mutate, modal }: ModalCreateUserProps) => {
  const onFinish = async (values: CreateUser) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
      onClose();
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      mutate();
    }
  };
  const onClose = () => {
    modal.closeModal();
    form.resetFields();
  };
  return (
    <div>
      <ButtonComponent onClick={modal.openModal} type="primary">
        {t('Create User')}
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={modal.closeModal}
        title={t('Create new user')}
        loading={isLoading}
      >
       {/**Content of modal**/}
      </ModalComponent>
    </div>
  );
};
```

```jsx
/// UserManagement.tsx
const modalCreate = useModal();

return <ModalCreateUser modal={modalCreate} mutate={mutate} />;
```

# FormComponent

- 1. Handle form base on Form of antd, have FormItemComponent
- 2. Parse form (to handle data of form) and onFinish (function when submit form)
- 3. Must have FormItemComponent (with name: defined form element, rules: validate form field, label: title of form element), children is input component (Input, InputNumber, DatePicker, Select, ...)
- 4. Must be called with useForm hooks of antd

**_For example_**

```jsx
const [form] = Form.useForm();

const onFinish = async (values: CreateUser) => {
  try {
    const response = await trigger({ body: values });
    toast.showSuccess(response.message);
    onClose();
  } catch (error: any) {
    toast.showError(error.message);
  } finally {
    mutate();
  }
};
return (
  <FormComponent form={form} onFinish={onFinish}>
    <FormItemComponent name="id" hidden>
      <Input />
    </FormItemComponent>
    <FormItemComponent
      rules={[{ required: true }]}
      name="name"
      label={<LabelForm>{t('Name')}:</LabelForm>}
    >
      <Input />
    </FormItemComponent>
    ...
  </FormComponent>
)
```

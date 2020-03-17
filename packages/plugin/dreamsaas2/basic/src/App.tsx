import React, {
  Children,
  FC,
  createContext,
  useState,
  useContext,
  useEffect
} from "react";
import "./App.css";
import useAxios from "axios-hooks";
import { IApplication } from "../../../../core/src/rewrite/application";

const ColumContainer: FC = props => (
  <div className="flex justify-start">{props.children}</div>
);
const Column: FC = props => (
  <div className="bg-gray-800 px-6 py-3 mr-3" {...props} />
);
const ColumnHeader: FC = props => (
  <h2 className="text-xl mb-2 tracking-wider font-thin" {...props} />
);

const List: FC = props => <ul className="" {...props} />;
const ListItem: FC = props => <li className="mb-2" {...props} />;

const SelectableListContext = createContext<{
  selected: string[];
  select: (id: string) => void;
  deselect: (id: string) => void;
  deselectAll: (id: string) => void;
}>({
  selected: [],
  select: () => {},
  deselect: () => {},
  deselectAll: () => {}
});

const SelectableList: FC<{
  onChange: (selected: string[]) => void;
  selected: string[];
}> = ({ onChange, selected, ...props }) => {
  const select = (value: string) => {
    if (!selected.includes(value)) {
      onChange(selected.concat(value));
    }
  };
  const deselect = (value: string) => {
    onChange(selected.filter(item => item !== value));
  };

  const deselectAll = (value: string) => {
    onChange([]);
  };
  return (
    <SelectableListContext.Provider
      value={{ selected, select, deselect, deselectAll }}
    >
      <ul className="" {...props} />
    </SelectableListContext.Provider>
  );
};
const SelectableListItem: FC<{ selectId: string }> = ({
  selectId,
  ...props
}) => {
  const context = useContext(SelectableListContext);
  const isSelected = context.selected.includes(selectId);
  const handleClick = () => {
    if (isSelected) {
      return context.deselect(selectId);
    }
    context.select(selectId);
  };

  return (
    <li
      className={`${isSelected ? "bg-gray-700 " : ""} mb-1 px-3 py-1 cursor-pointer`}
      onClick={handleClick}
      {...props}
    />
  );
};

function App() {
  const [{ data, error }] = useAxios<IApplication>(
    "http://localhost:3001/api/app"
  );
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedPipes, setSelectedPipes] = useState<string[]>([]);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  const pipesFilter = Object.values(data.pipes).filter(pipe => {
    if (selectedEvents.length === 0) return true;

    const events = selectedEvents.map(eventName => data.events[eventName]);

    return events.reduce<boolean>((accum, current) => {
      if (accum === true) return true;
      if (current.pipes?.includes(pipe.name)) return true;
      return accum;
    }, false);
  });

  const actionsFilter = Object.values(data.actions).filter(action => {
    if (selectedPipes.length === 0) return true;

    const pipes = selectedPipes.map(name => data.pipes[name]);

    return pipes.reduce<boolean>((accum, current) => {
      if (accum === true) return true;
      if (current.actions?.includes(action.name)) return true;
      return accum;
    }, false);
  });

  return (
    <div className="bg-gray-900 text-white h-screen overflow-scroll">
      <div className="p-6">
        <ColumContainer>
          <Column>
            <ColumnHeader>Events</ColumnHeader>
            <SelectableList
              selected={selectedEvents}
              onChange={setSelectedEvents}
            >
              {Object.values(data.events).map(item => {
                return (
                  <SelectableListItem selectId={item.name} key={item.name}>
                    {item.name}
                  </SelectableListItem>
                );
              })}
            </SelectableList>
          </Column>
          <Column>
            <ColumnHeader>Pipes</ColumnHeader>
            <SelectableList
              selected={selectedPipes}
              onChange={setSelectedPipes}
            >
              {pipesFilter.map(item => {
                return (
                  <SelectableListItem selectId={item.name} key={item.name}>
                    {item.name}
                  </SelectableListItem>
                );
              })}
            </SelectableList>
          </Column>
          <Column>
            <ColumnHeader>Actions</ColumnHeader>
            <List>
              {actionsFilter.map(item => {
                return <ListItem key={item.name}>{item.name}</ListItem>;
              })}
            </List>
          </Column>
        </ColumContainer>
      </div>
    </div>
  );
}

export default App;

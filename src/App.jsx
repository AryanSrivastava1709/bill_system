import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState([]);
  const [newFriendAdd, setNewFriends] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);
  function handleToggleform() {
    setNewFriends((s) => !s);
  }

  function handleAddFriends(friend) {
    setFriends((s) => [...s, friend]);
    setNewFriends(false);
  }
  function handleSelect(friend) {
    // setSelectFriend(friend);
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setNewFriends(false);
  }
  function handleSplitBill(value) {
    setFriends((curr) =>
      curr.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          list={friends}
          onSelect={handleSelect}
          selectFriend={selectFriend}
        />
        {newFriendAdd && <FormAddFriend onAddFriend={handleAddFriends} />}
        <Button onclick={handleToggleform}>
          {newFriendAdd ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill selected={selectFriend} onSplit={handleSplitBill} />
      )}
    </div>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function FriendsList({ list, onSelect, selectFriend }) {
  return (
    <div>
      <ul>
        {list.map((el) => (
          <Friend
            friend={el}
            key={el.id}
            onSelect={onSelect}
            selectFriend={selectFriend}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ friend, onSelect, selectFriend }) {
  const isSelected = friend.id === selectFriend?.id;
  const balance_abs = Math.abs(friend.balance);
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt="user-img" />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{balance_abs}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{balance_abs}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even.</p>}
      <Button onclick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selected, onSplit }) {
  const [bill, setBill] = useState("");
  const [myexpense, setMyExpense] = useState("");
  const paidByFriend = bill ? bill - myexpense : "";
  const [paidBy, setPaidBy] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !myexpense) return;
    onSplit(paidBy === "user" ? paidByFriend : -myexpense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selected.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🤑Your expense</label>
      <input
        type="text"
        value={myexpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > bill ? myexpense : Number(e.target.value)
          )
        }
      ></input>
      <label>😁{selected.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}></input>
      <label>😢Who is paying the bill?</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selected.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

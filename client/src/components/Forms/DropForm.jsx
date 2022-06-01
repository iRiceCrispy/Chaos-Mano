import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TagsDropDown from '../FormFields/TagsDropDown';
import SearchDropDown from '../FormFields/SearchDropDown';
import ValidationError from '../FormFields/ValidationError';
import { createDrop, updateDrop, dropsSelectors } from '../../store/drops';
import { partiesSelectors } from '../../store/parties';
import bossList from '../../util/bossList.json';
import itemList from '../../util/itemList.json';
import './forms.scss';

const DropForm = ({ edit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const drop = useSelector(state => dropsSelectors.selectById(state, id));
  const party = useSelector(state => partiesSelectors.selectById(state, edit ? drop.party.id : id));
  const [bossId, setBossId] = useState(edit ? drop.bossName : '');
  const [itemId, setIemId] = useState(edit ? drop.itemName : '');
  const [image, setImage] = useState(edit ? drop.image : '');
  const [members, setMembers] = useState(edit
    ? drop.members.map(mem => ({ id: mem.user.id, value: mem.user.username }))
    : party.members.map(user => ({ id: user.id, value: user.username })));
  const [errors, setErrors] = useState({});

  const bosses = Object.entries(bossList).reduce((accum, [key, value]) => {
    accum.push({ id: key, value: value.name });
    return accum;
  }, []);
  const boss = bossList[bossId];

  const items = boss
    ? bossList[bossId].drops.reduce((accum, value) => {
      accum.push({ id: value, value });
      return accum;
    }, [])
    : undefined;
  const item = itemList[itemId];

  const submitForm = (e) => {
    e.preventDefault();
    setErrors({});

    if (!edit) {
      const newDrop = {
        bossName: bossId,
        itemName: itemId,
        image,
        memberIds: members.map(member => member.id),
      };

      dispatch(createDrop({ partyId: party.id, drop: newDrop }))
        .unwrap()
        .then((res) => {
          navigate(`/dashboard/drops/${res.id}`, { replace: true });
        })
        .catch((err) => {
          setErrors(err);
        });
    }
    else {
      const bossChanged = bossId.id !== drop.bossName;
      const itemChanged = itemId.id !== drop.itemName;
      const imageChanged = image !== drop.image;
      const membersChanged = JSON.stringify(members.map(member => member.id))
        !== JSON.stringify(drop.members.map(member => member.user.id));

      if (bossChanged || itemChanged || imageChanged || membersChanged) {
        const editedDrop = {
          ...drop,
          bossName: bossId,
          itemName: itemId,
          image,
          memberIds: members.map(member => member.id),

        };

        dispatch(updateDrop(editedDrop))
          .unwrap()
          .then((res) => {
            navigate(`/dashboard/drops/${res.id}`, { replace: true });
          })
          .catch((err) => {
            setErrors(err);
          });
      }
      else navigate(`/dashboard/drops/${id}`, { replace: true });
    }
  };

  return (
    <form id="dropForm" className="form" onSubmit={submitForm}>
      <header>
        <h2 className="formTitle">{edit ? 'Edit drop' : 'Add a drop'}</h2>
      </header>
      <main className="formContent">
        <div className="inputContainer bossName">
          <label htmlFor="bossName">Boss Name</label>
          <SearchDropDown
            id="bossName"
            placeholder="Boss Name"
            index={2}
            options={bosses}
            result={boss?.name}
            setResult={setBossId}
          />
          <ValidationError message={errors.bossName} />
        </div>
        <div className="inputContainer itemName">
          <label htmlFor="itemName">Item Name</label>
          <SearchDropDown
            id="itemName"
            placeholder="Item Name"
            zIndex={1}
            options={items}
            disabled={!bossId}
            result={item?.name}
            setResult={setIemId}
          />
          <ValidationError message={errors.itemName} />
        </div>
        <div className="inputContainer image">
          <label htmlFor="image">Image (optional)</label>
          <input
            id="image"
            type="text"
            value={image}
            placeholder="https://www.image.com/image.png"
            onChange={e => setImage(e.target.value)}
          />
          <ValidationError message={errors.image} />
        </div>
        <div className="inputContainer members">
          <label htmlFor="members">Members</label>
          <TagsDropDown
            id="members"
            placeholder="Members"
            options={(edit ? drop.party.members : party.members)
              .map(user => ({ id: user.id, value: user.username }))}
            results={members}
            setResult={setMembers}
          />
          <ValidationError message={errors.memberIds} />
        </div>
      </main>
      <footer>
        <button className="btn light" type="submit">{edit ? 'Confirm' : 'Create Drop'}</button>
      </footer>
    </form>
  );
};

export default DropForm;

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TagsDropDown from '../FormFields/TagsDropDown';
import ValidationError from '../FormFields/ValidationError';
import { getSessionUser } from '../../store/session';
import { usersSelectors } from '../../store/users';
import { createParty, updateParty, partiesSelectors } from '../../store/parties';
import './forms.scss';

const PartyForm = ({ edit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const party = useSelector(state => partiesSelectors.selectById(state, id));
  const [name, setName] = useState(edit ? party.name : '');
  const [members, setMembers] = useState(edit
    ? party.members.map(member => ({ id: member.id, value: member.username }))
    : []);
  const [errors, setErrors] = useState({});
  const sessionUser = useSelector(getSessionUser);
  const users = useSelector(usersSelectors.selectAll);

  const submitForm = (e) => {
    e.preventDefault();
    setErrors({});

    if (!edit) {
      const newParty = {
        name,
        leaderId: sessionUser.id,
        memberIds: members.map(member => member.id),
      };

      dispatch(createParty(newParty))
        .unwrap()
        .then((res) => {
          navigate(`/dashboard/parties/${res.id}`, { replace: true });
        })
        .catch((err) => {
          setErrors(err);
        });
    }
    else {
      const nameChanged = name !== party.name;
      const membersChanged = JSON.stringify(members.map(member => member.id))
        !== JSON.stringify(party.members.map(member => member.id));

      if (nameChanged || membersChanged) {
        const editedParty = {
          ...party,
          name,
          memberIds: members.map(member => member.id),
        };

        dispatch(updateParty(editedParty))
          .unwrap()
          .then((res) => {
            navigate(`/dashboard/parties/${res.id}`, { replace: true });
          })
          .catch((err) => {
            setErrors(err);
          });
      }
      else navigate(`/dashboard/parties/${id}`);
    }
  };

  return (
    <form id="partyForm" className="form" onSubmit={submitForm}>
      <header>
        <h2 className="formTitle">{edit ? 'Edit party' : 'Create new a party'}</h2>
      </header>
      <main>
        <div className="inputContainer partyName">
          <label htmlFor="partyName">Party Name</label>
          <input
            id="partyName"
            type="text"
            value={name}
            placeholder="Party Name"
            onChange={e => setName(e.target.value)}
          />
          <ValidationError message={errors.name} />
        </div>
        <div className="tags">
          <label htmlFor="partyMembers">Members</label>
          <TagsDropDown
            id="partyMembers"
            placeholder="Members"
            options={users.map(user => ({ id: user.id, value: user.username }))}
            results={members}
            setResult={setMembers}
          />
          <ValidationError message={errors.memberIds} />
        </div>
      </main>
      <footer>
        <button className="btn light" type="submit">{edit ? 'Confirm' : 'Create Party'}</button>
      </footer>
    </form>
  );
};

export default PartyForm;

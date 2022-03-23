import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../Modal';
import Party from './Party';
import PartyForm from '../Forms/PartyForm';
import './Parties.css';

const Parties = () => {
  const [showCreate, setShowCreate] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const parties = Object.values(useSelector(state => state.parties));

  const [partiesL, partiesM] = parties.reduce(([l, m], party) => (
    party.leader.id === sessionUser.id ? [[...l, party], m] : [l, [...m, party]]
  ), [[], []]);

  return (
    <div className='partiesContainer'>
      {showCreate
        ? (
          <Modal showModal={setShowCreate}>
            <PartyForm showForm={setShowCreate} />
          </Modal>
        )
        : (<button className='btn createParty' type='button' onClick={() => setShowCreate(true)}>Create new party</button>)}
      {partiesL.length > 0 && (
        <div className='leaderOf'>
          {partiesL.map(party => (
            <Party sessionUser={sessionUser} party={party} isLeader />
          ))}
        </div>
      )}
      {partiesM.length > 0 && (
        <div className='memberOf'>
          {partiesM.map(party => (
            <Party sessionUser={sessionUser} party={party} />
          ))}
        </div>
      )}
      {!partiesL.length && !partiesM.length && (
      <p>
        You are not part of any party.
        Either create your own, or join one.
      </p>
      )}
    </div>
  );
};

export default Parties;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ValidationError from '../FormFields/ValidationError';
import { addSale } from '../../store/drops';
import './forms.scss';

const SaleForm = ({ drop, setShowForm }) => {
  const dispatch = useDispatch();
  const [price, setPrice] = useState('0');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState({});

  const changePrice = (e) => {
    if (!e.target.value.match(/^(|[,\d])+$/)) return;

    setPrice(+(e.target.value).replace(/,/g, ''));
  };

  const submitForm = (e) => {
    e.preventDefault();
    setErrors({});

    const newSale = {
      price,
      saleImage: image,
    };

    dispatch(addSale({ dropId: drop.id, sale: newSale }))
      .unwrap()
      .then(() => setShowForm(false))
      .catch((err) => {
        setErrors(err);
      });
  };

  return (
    <form id="saleForm" className="form" onSubmit={submitForm}>
      <header>
        <h2 className="formTitle">Input sales info.</h2>
      </header>
      <main>
        <div className="inputContainer price">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="text"
            value={price.toLocaleString()}
            onChange={changePrice}
            placeholder="0"
            onFocus={() => price <= 0 && setPrice('')}
            onBlur={() => !price && setPrice('0')}
          />
          <ValidationError message={errors.price} />
        </div>
        <div className="inputContainer saleImage">
          <label htmlFor="saleImage">Image (optional)</label>
          <input
            id="image"
            type="text"
            value={image}
            placeholder="https://www.image.com/image.png"
            onChange={e => setImage(e.target.value)}
          />
          <ValidationError message={errors.saleImage} />
        </div>
      </main>
      <footer>
        <button className="btn light submit" type="submit">Confirm</button>
      </footer>
    </form>
  );
};

export default SaleForm;

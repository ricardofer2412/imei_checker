import React from 'react'



const BoostForm = (props) => {

  return (
    <form onSubmit={props.getStatus}>
      <label>T-Mobile </label>
      <input type='text' name='imei' />
      <button>Search</button>
    </form>
  )
}

export default BoostForm;
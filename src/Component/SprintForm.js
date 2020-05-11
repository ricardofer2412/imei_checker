import React from 'react'



const SprintForm = (props) => {

  return (
    <form onSubmit={props.getSprint}>
      <label>Sprint </label>
      <input type='text' name='sprintImei' />
      <button>Search</button>
    </form>
  )
}

export default SprintForm;
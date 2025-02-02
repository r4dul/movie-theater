import React from 'react';

const SearchBox = ({value, onChange}) => {
    return (
        <input type="text" name="query" className="form-control s sidebar " placeholder="Search movie..." value={value} onChange={e =>onChange(e.currentTarget.value)}/>
      );
}
 
export default SearchBox;
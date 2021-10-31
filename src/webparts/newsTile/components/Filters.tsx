import * as React from 'react';
import {Web} from '@pnp/sp/webs';
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './NewsTile.module.scss';
import { UrlFieldFormatType } from '@pnp/sp/fields/types';


const Filters=(props)=>{
    const [filterValues,setFilterValues]=React.useState([]);
    React.useEffect(() => {
       setFilterValues(props.filters);
      }, [props.filters]); 
    
      return(<div> {filterValues && filterValues.length>0 &&filterValues.map((it,ind)=>{
           return(<button className={it.active?styles.selectedItem: styles.item} key={ind} onClick={(it)=>props.changedFilterNews({it})}>{it}</button>)
          })}
        </div> )

}
export default Filters;
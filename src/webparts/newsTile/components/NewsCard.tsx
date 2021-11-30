import * as React from 'react';
import {Web} from '@pnp/sp/webs';
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './NewsTile.module.scss';
import { UrlFieldFormatType } from '@pnp/sp/fields/types';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const NewsCard=(props)=>{
    const formattedDate = (date) => (date.getUTCDate() + " " + monthNames[date.getMonth()] + ', ' + date.getUTCFullYear());
    console.log('dtr',props);
      return(<div  className={styles.newsCard}  >
              <div  className={styles.image} style={{backgroundImage:`url(${props.bannerImageUrl})`}} ></div>
              <div className={styles.tileText}>
                    <div className={styles.tileHeader} >{props.topicHeader}</div>
                    <div className={styles.tileBody}><a href={props.url} target="_blank" data-interception="off" style={{ color: 'inherit', textDecoration: 'none' }}>{props.title}</a> </div>
                    <div className={styles.tileDate}>{formattedDate(new Date(props.issueDate))}</div>
              </div>


      </div>)

}
export default NewsCard;
import * as React from 'react';
import {Web} from '@pnp/sp/webs';
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import styles from './NewsTile.module.scss';
import { INewsTileProps } from './INewsTileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { INews } from './INews';
import NewsCard from './NewsCard';
import Filters from './Filters';
interface INewsTitleState{
  newsList: INews[];
  filters:any[]
}
export default class NewsTile extends React.Component<INewsTileProps, INewsTitleState> {
  constructor(props:INewsTileProps){
  super(props);
      this.state={
      newsList:[] as INews[],
      filters :[{name:'All',active:true}]
      }

  } 
public async componentDidMount(){
    const web=Web(`${this.props.newsSiteUrl}`);
    const r= await web();
  //  const filterStr=this.props.filterField;
  let filterStr='';
  const filterValuesArr=this.props.filterValues &&this.props.filterValues.split(',');
  this.setState({...this.state,filters:[...this.state.filters, ...filterValuesArr.map(a=>({name:a,active:false}))]});
  if(filterValuesArr && filterValuesArr.length>0 && filterValuesArr.filter(a=>a!='All'))
  {
   filterStr=filterValuesArr.reduce((rdc,item,i)=>( rdc+ (i==0?`${this.props.filterField} eq '${item}' `: ` or ${this.props.filterField} eq '${item}' `)),'') ;
  }
  else if (this.props.filterField)
  {
    filterStr= `${this.props.filterField} ne null and ${this.props.filterField} ne 'n/a'`
  }

  let selectedFields=`AuthorId,Author/Title,BannerImageUrl ,Created,Title,SliderDisplayOrder,FirstPublishedDate,OData__TopicHeader,FileLeafRef`;
  selectedFields=this.props.filterField?selectedFields + `, ${this.props.filterField}`:selectedFields;
 
  let newsItems = await web.lists.getByTitle('Site Pages').items.filter(filterStr).select(selectedFields).expand(`Author`).orderBy("Id", true).top(this.props.numberOfDisplayNews).get();
   
    newsItems = newsItems.sort((a, b) => (a.Id > b.Id ? 1 : -1));
    const news = newsItems.map((a) => ({ title: a.Title, bannerImageUrl:a.BannerImageUrl.Url.indexOf('/thumbnails/')==-1? `${a.BannerImageUrl.Url}&resolution=6`:`${a['BannerImageUrl']['Url'].split("file=")[0].substring(0,a['BannerImageUrl']['Url'].split("file=")[0].indexOf('/thumbnails/'))+ "/" +a['BannerImageUrl']['Url'].split("file=")[1]}`, authorTitle: a.Author.Title, created: a.FirstPublishedDate, sliderDisplayOrder: a.SliderDisplayOrder, topicHeader: a.OData__TopicHeader, url: `${this.props.newsSiteUrl}/SitePages/${a.FileLeafRef}` })) as INews[];
   
    this.setState({...this.state,newsList:news});
  }
  changedFilterNews=(it)=>{
    console.log('click');
     this.setState({...this.state,filters:this.state.filters.map((a,ind)=>({...a,active:a.name==it.name?true:false}))});
  }
  public render() {
    return (
      <div className={ styles.newsTile }>
        {/* {this.state.filters && this.state.filters.length>0 &&
        <Filters  filters={this.state.filters} />
      } */}
       
        <div className={styles.container}>
          
         {this.state.newsList && this.state.newsList.length>0 && this.state.newsList.map((a,index)=>{
           return(<NewsCard  key={index} {...a}/>)

          })}
        </div>
      </div>
    );
  }
}

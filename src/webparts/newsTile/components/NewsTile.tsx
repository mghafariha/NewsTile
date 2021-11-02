import * as React from 'react';
import {Web} from '@pnp/sp/webs';
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import styles from './NewsTile.module.scss';
import { INewsTileProps } from './INewsTileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { INews } from './INews';
import NewsCard from './NewsCard';
import Filters from './Filters';
interface INewsTitleState{
  newsList: INews[];
  filters:any[];
  fieldDisplayName:string;
 
}
export default class NewsTile extends React.Component<INewsTileProps, INewsTitleState> {
  constructor(props:INewsTileProps){
  super(props);
      this.state={
      newsList:[] as INews[],
      filters :[{name:'All',active:true}],
      fieldDisplayName:''
      
      }

  } 
public async componentDidMount(){
    const web=Web(`${this.props.newsSiteUrl}`);
    const r= await web();
  //  const filterStr=this.props.filterField;
if(this.props.filterField)
{
  const field=await web.lists.getByTitle('Site Pages').fields.getByInternalNameOrTitle(`${this.props.filterField}`).get();
this.setState({...this.state,fieldDisplayName:field.Title});
}
  let filterStr='';
  const filterValuesArr=this.props.filterValues &&this.props.filterValues.split(',') ||[];
  const filterArr=[...this.state.filters, ...filterValuesArr.map(a=>({name:a,active:false}))];
  console.log('filterArr',filterArr);
  this.setState({...this.state,filters:filterArr});
  if(filterValuesArr && filterValuesArr.length>0 && filterValuesArr.filter(a=>a!='All'))
  {
   filterStr=filterValuesArr.reduce((rdc,item,i)=>( rdc+ (i==0?`${this.props.filterField} eq '${item}' `: ` or ${this.props.filterField} eq '${item}' `)),'') ;
  }
  else if (this.props.filterField)
  {
    filterStr= `${this.props.filterField} ne null and ${this.props.filterField} ne 'n/a'`
  }
  else {
    filterStr=``
  }
  

  let selectedFields=`Id,AuthorId,Author/Title,BannerImageUrl ,Created,Title,FirstPublishedDate,OData__TopicHeader,FileLeafRef`;
  selectedFields=this.props.filterField?selectedFields + `, ${this.props.filterField}`:selectedFields;
 
  let newsItems = await web.lists.getByTitle('Site Pages').items.filter(filterStr).select(selectedFields).expand(`Author`).orderBy("Id", false).top(this.props.numberOfDisplayNews).get();
   
  newsItems = newsItems.sort((a, b) => (a.Id > b.Id ? -1 : 1));
    const news = newsItems.map((a) => ({ title: a.Title, bannerImageUrl:a.BannerImageUrl.Url.indexOf('/thumbnails/')==-1? `${a.BannerImageUrl.Url}&resolution=6`:`${a['BannerImageUrl']['Url'].split("file=")[0].substring(0,a['BannerImageUrl']['Url'].split("file=")[0].indexOf('/thumbnails/'))+ "/" +a['BannerImageUrl']['Url'].split("file=")[1]}`, authorTitle: a.Author.Title, created: a.FirstPublishedDate, sliderDisplayOrder: a.SliderDisplayOrder, topicHeader: a.OData__TopicHeader, url: `${this.props.newsSiteUrl}/SitePages/${a.FileLeafRef}` })) as INews[];
   console.log('news',news);
    this.setState({...this.state,newsList:news});
}
changedFilterNews=async(it)=>{
    console.log('click',it);
    console.log('filtersss',this.state.filters);
     this.setState({...this.state,filters:this.state.filters.map((a,ind)=>({...a,active:a.name===it.name?true:false}))});
//
  let filterStr= `${this.props.filterField} ne null and ${this.props.filterField} ne 'n/a' `;
if(it.name!="All")
{
  filterStr=filterStr+ ` and ${this.props.filterField} eq '${it.name}'`;
}
else {
  if(this.state.filters.length>0)
  {
   filterStr=this.state.filters.filter(a=>a.name!='All').reduce((rdc,item,i)=>( rdc+ (i==0?`${this.props.filterField} eq '${item.name}' `: ` or ${this.props.filterField} eq '${item.name}' `)),'') ;
  }
}

  let selectedFields=`Id,AuthorId,Author/Title,BannerImageUrl ,Created,Title,FirstPublishedDate,OData__TopicHeader,FileLeafRef`;
  selectedFields=this.props.filterField?selectedFields + `, ${this.props.filterField}`:selectedFields;
  const web=Web(`${this.props.newsSiteUrl}`);
  const r= await web();
  let newsItems = await web.lists.getByTitle('Site Pages').items.filter(filterStr).select(selectedFields).expand(`Author`).orderBy("Id", false).top(this.props.numberOfDisplayNews).get();
   
    newsItems = newsItems.sort((a, b) => (a.Id > b.Id ? -1 : 1));
    const news = newsItems.map((a) => ({ title: a.Title, bannerImageUrl:a.BannerImageUrl.Url.indexOf('/thumbnails/')==-1? `${a.BannerImageUrl.Url}&resolution=6`:`${a['BannerImageUrl']['Url'].split("file=")[0].substring(0,a['BannerImageUrl']['Url'].split("file=")[0].indexOf('/thumbnails/'))+ "/" +a['BannerImageUrl']['Url'].split("file=")[1]}`, authorTitle: a.Author.Title, created: a.FirstPublishedDate, sliderDisplayOrder: a.SliderDisplayOrder, topicHeader: a.OData__TopicHeader, url: `${this.props.newsSiteUrl}/SitePages/${a.FileLeafRef}` })) as INews[];
   console.log('news',news);
    this.setState({...this.state,newsList:news});
  


  }
  public render() {
    return ( 
      <div className={ styles.newsTile }>
       
        {this.state.filters && this.state.filters.length>0 &&
        <Filters  filters={this.state.filters} changedFilterNews={this.changedFilterNews}  displayName={this.state.fieldDisplayName}/>
      
      }
       
        <div className={styles.container}>
          
         {this.state.newsList && this.state.newsList.length>0 && this.state.newsList.map((a,index)=>{
           return(<NewsCard  key={index} {...a}/>)

          })}
        </div>
      </div>
    );
  }
}

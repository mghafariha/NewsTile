import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { sp } from "@pnp/sp";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewsTileWebPartStrings';
import NewsTile from './components/NewsTile';
import { INewsTileProps } from './components/INewsTileProps';

export interface INewsTileWebPartProps {
  description: string;
  newsSiteUrl:string;
  numberOfDisplayNews:number;
  filterField:string;
  filterValues:string;
}

export default class NewsTileWebPart extends BaseClientSideWebPart<INewsTileWebPartProps> {



  public render(): void {
    const element: React.ReactElement<INewsTileProps> = React.createElement(
      NewsTile,
      {
        description: this.properties.description,
        numberOfDisplayNews:this.properties.numberOfDisplayNews ||3,
        newsSiteUrl:this.properties.newsSiteUrl,
        filterField:this.properties.filterField,
        filterValues:this.properties.filterValues
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected async onInit(): Promise<void>{
   // this.properties.cssUrl ? SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + this.properties.cssUrl) : SPComponentLoader.loadCss(customStyleUrl);


    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('newsSiteUrl', {
                  label:'News Site Url'
                }),
                PropertyPaneTextField('numberOfDisplayNews', {
                  label: 'Count of display news'
                }),
                PropertyPaneTextField('filterField', {
                  label: 'Field that is used to filter news'
                }),
                PropertyPaneTextField('filterValues', {
                  label: 'Values that is used to filter news'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

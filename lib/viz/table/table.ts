import _ = require('underscore');
import Common = require('../visualization');
import Config = require('../config');
import Dataset = require('./dataset');
import TableRenderer = require('./renderer');
import Queries = require('../../core/queries/queries');
import Api = require('../../core/api');
import Loader = require('../loader');
import Clear = require('../clear');
import ErrorHandling = require('../error-handling');

class Table implements Common.Visualization {
    public targetElementId: string;
	private _options: Config.TableOptions;
	private _rendered: boolean;
    private _titleElement: HTMLElement;
    private _tableWrapper: HTMLElement;
	private _loader: Loader;

	constructor(targetElementId: string, suppliedOptions: Config.TableOptions) {
	    var defaultTableOptions: Config.TableOptions = { 
                fieldOptions: {},
                intervalOptions: {}
            },
            defaultIntervalOptions = {
                formats: Config.defaultTimeSeriesFormats
            };
        this.targetElementId = targetElementId;
	    this._options = _.extend(defaultTableOptions, suppliedOptions);
        this._options.intervalOptions = _.extend(this._options.intervalOptions, defaultIntervalOptions);
	    this._loader = new Loader(this.targetElementId);
        this._loadData = ErrorHandling.makeSafe(this._loadData, this, this._loader);
	}

	public displayData(resultsPromise: Q.IPromise<Api.QueryResults>, metadata: Queries.Metadata) {
		this._renderTable(metadata);
        this._startLoading();
        resultsPromise.then(results => {
            this._loadData(results, metadata);
            this._finishLoading();
        });
    }

    private _startLoading() {
        this._loader.show();
        this._tableWrapper.className += ' isLoading';
    }

    private _finishLoading() {
        this._loader.hide();
        this._tableWrapper.className = this._tableWrapper.className.replace(/(?:^|\s)isLoading(?!\S)/, '');
    }

	private _loadData(results: Api.QueryResults, metadata: Queries.Metadata) {
        var dataset = new Dataset.TableDataset(metadata, this._options, results);
        this._tableWrapper.innerHTML = TableRenderer.renderDataset(dataset);
        this._showTitle();
    }

    public clear() {        
    	this._rendered = false;
        Clear.removeAllChildren(this.targetElementId)
    }

    private _showTitle(){
        var options = this._options,
            titleText = options.title ? options.title.toString() : '',
            showTitle = titleText.length > 0;

        this._titleElement.textContent = titleText;
        this._titleElement.style.display = !showTitle ? 'none' : '';      
    }

    private _renderTable(metadata: Queries.Metadata) {
        if(this._rendered)
            return;
            
        var options = this._options,
            tableContainer: HTMLElement = document.createElement('div'),
            tableWrapper = document.createElement('div'),
            rootElement = document.querySelector(this.targetElementId),
            titleElement = document.createElement('span')

        this.clear();

        tableContainer.className = 'connect-viz connect-table';
        titleElement.className = 'connect-viz-title';
        tableWrapper.className = 'connect-table-wrapper';

        tableContainer.appendChild(titleElement);
        tableContainer.appendChild(tableWrapper);

        rootElement.appendChild(tableContainer);

        this._rendered = true;

        this._tableWrapper = tableWrapper;
        this._titleElement = titleElement;
        this._showTitle();
    }
}

export = Table;
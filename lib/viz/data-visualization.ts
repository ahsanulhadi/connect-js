import Queries = require('../core/queries/queries');
import Api = require('../core/api');
import Common = require('./visualization');
import Loader = require('./loader');
import ErrorHandling = require('./error-handling');

class DataVisualization{
    private _visualization: Common.Visualization;
    private _query: Queries.ConnectQuery;
    private _isLoading: boolean;

    constructor(query: Queries.ConnectQuery, visualization: Common.Visualization) {
        this._query = query;
        this._visualization = visualization;
        this._isLoading = false;

        this.refresh();
    }

    public refresh() {
        if (this._isLoading)
            return;

        this._isLoading = true;
        var qryPromise = this._query.execute(),
            loadingTracker = qryPromise.then(
                (data) => { this._isLoading = false }, 
                (error: Error) => this._renderError(error));

        this._visualization.displayData(qryPromise, this._query.metadata());
    }

    private _renderError(error: Error): void{
        var targetElementId = this._visualization.targetElementId;
        
        this._visualization.clear();
        ErrorHandling.logError(error);
        ErrorHandling.displayFriendlyError(targetElementId);
    }
}

export = DataVisualization;
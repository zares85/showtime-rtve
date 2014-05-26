/*
 *  rtve  - Showtime Plugin
 *
 *  Copyright (C) 2014 Carlos Jurado
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (plugin) {
    const PREFIX = 'rtve';
    const TITLE = 'rtve';
    const BASEURL = 'http://www.rtve.es';
    const PROGRAM_BASEURL = 'http://www.rtve.es/alacarta/interno/contenttable.shtml';
    const VIDEOS_BASEURL = 'http://mvod.lvlt.rtve.es';
    const PYDOWNTV_BASEURL = 'http://www.pydowntv.com/api';
    const VIDEOINFO_BASEURL = 'http://www.rtve.es/drmn/embed/video/';
    const LOGO = 'http://img.irtve.es/css/rtve.commons/rtve.header.footer/i/logoRTVEes.png';
    const CATEGORIES = [
        {id: 'todos',               title: 'Todos los programas'},
        {id: 'archivo',             title: 'Archivo'},
        {id: 'ciencia-y-tecnologia',title: 'Ciencia y Tecnología'},
        {id: 'cine',                title: 'Cine'},
        {id: 'concursos',           title: 'Concursos'},
        {id: 'cultura',             title: 'Cultura'},
        {id: 'deportes',            title: 'Deportes'},
        {id: 'documentales',        title: 'Documentales'},
        {id: 'educacion',           title: 'Educación'},
        {id: 'filmoteca',           title: 'Filmoteca'},
        {id: 'humor',               title: 'Humor'},
        {id: 'infantiles',          title: 'Infantiles'},
        {id: 'informativos',        title: 'Informativos'},
        {id: 'magacin',             title: 'Magacín'},
        {id: 'musica',              title: 'Música'},
        {id: 'recetas',             title: 'Recetas'},
        {id: 'religiosos',          title: 'Religiosos'},
        {id: 'series',              title: 'Series'},
        {id: 'viajes',              title: 'Viajes'},
        {id: 'otros-programas',     title: 'Otros Programas'}
    ];
    const SUBCATEGORIES = {
        musica: [
            {id: 'musica',                  title: 'Toda la música'},
            {id: 'musicas-del-mundo',       title: 'Músicas del mundo'},
            {id: 'clasica',                 title: 'Clásica'},
            {id: 'culturales',              title: 'Culturales'},
            {id: 'rock-pop',                title: 'Rock/Pop'},
            {id: 'radioformula',            title: 'Radiofórmula'},
            {id: 'conciertos',              title: 'Conciertos'},
            {id: 'electronica-experimental',title: 'Electrónica/Experimental'},
            {id: 'jazz-blues',              title: 'Jazz/Blues'},
            {id: 'hiphop-funk',             title: 'HipHop/Funk'}
        ],
        documentales: [
            {id: 'documentales',                        title: 'Todos los documentales'},
            {id: 'documentales-de-naturaleza',          title: 'Documentales de naturaleza'},
            {id: 'documentales-de-historia',            title: 'Documentales de historia'},
            {id: 'documentales-de-biografias',          title: 'Documentales de biografías'},
            {id: 'documentales-de-ciencia-y-tecnologia',title: 'Documentales de ciencia y tecnología'},
            {id: 'documentales-de-culturas',            title: 'Documentales de culturas'},
            {id: 'documentales-de-actualidad',          title: 'Documentales de actualidad'},
            {id: 'documentales-de-deportes',            title: 'Documentales de deportes'},
            {id: 'documentales-de-gastronomia',         title: 'Documentales de gastronomía'},
            {id: 'documentales-de-viajes',              title: 'Documentales de viajes'},
            {id: 'documentales-de-artes',               title: 'Documentales de artes'}
        ],
        archivo: [
            {id: 'archivo',                     title: 'Todo el archivo'},
            {id: 'especiales-en-el-archivo',    title: 'Especiales en el archivo'},
            {id: 'series-en-el-archivo',        title: 'Series en el archivo'},
            {id: 'programas-en-el-archivo',     title: 'Programas en el archivo'},
            {id: 'documentales-en-el-archivo',  title: 'Documentales en el archivo'}
        ],
        informativos: [
            {id: 'informativos',                title: 'Todos los informativos'},
            {id: 'informativos-territoriales',  title: 'Informativos territoriales'}
        ],
        filmoteca: [
            {id: 'filmoteca',                   title: 'Toda la filmoteca'},
            {id: 'documentales-filmoteca',      title: 'Documentales - Filmoteca'},
            {id: 'cortometrajes-filmoteca',     title: 'Cortometrajes - Filmoteca'},
            {id: 'peliculas-filmoteca',         title: 'Películas - Filmoteca'}
        ]
    };
    const CHANNELS = [
        {id: 'la1',             title: 'La 1'},
        {id: 'la2',             title: 'La 2'},
        {id: '24-horas',        title: 'Canal 24 horas'},
        {id: 'teledeporte',     title: 'Teledeporte'},
        {id: 'clan',            title: 'Clan'}
    ];
    const STATIONS = [
        {id: 'radio-nacional',  title: 'Radio Nacional'},
        {id: 'radio-clasica',   title: 'Radio Clásica'},
        {id: 'radio-3',         title: 'Radio 3'},
        {id: 'radio-4',         title: 'Ràdio 4'},
        {id: 'radio-5',         title: 'Radio 5'},
        {id: 'radio-exterior',  title: 'Radio Exterior'}
    ];
    const REGEX_PROGRAM = /"col_tit".*?id *= *"([0-9]*)".*?href *= *"(.*?)".*?>(.*?)<\/a.*"col_fec".*?>(.*?)<.*"detalle".*?>(.*?)</;
    const REGEX_EPISODE = /"col_tit".*?id *= *"([0-9]*)".*?href *= *"(.*?)".*?>(.*?)<\/a.*"col_dur".*?>(.*?)<.*"col_fec".*?>(.*?)<.*"detalle".*?>(.*?)</;
    const REGEX_RESULT = /.*name.*?href.*?> *(?:<!--.*?-->)*(.*?)<.*thum.*.*href="(.*?)".*?image.*src="(.*?)".*date.*?>(.*?)<.*?texto.*?> *(?:<!--.*?-->)(.*?)</; // url, image, date, desc

    // Create the showtime service and link to the statPage
    plugin.createService(TITLE, PREFIX + ':start', 'video', true, LOGO);

    // Create the searcher
    plugin.addSearcher(TITLE, LOGO, searchPage);

    // Map URIs and functions
    plugin.addURI(PREFIX + ':start', startPage);
    plugin.addURI(PREFIX + ':channel:(.*)', channelPage); // channel object
    plugin.addURI(PREFIX + ':station:(.*)', stationPage); // radio object
    plugin.addURI(PREFIX + ':supercat:(.*)', superCategoryPage); //category object
    plugin.addURI(PREFIX + ':category:(.*)', categoryPage); //category object
    plugin.addURI(PREFIX + ':program:(.*)', programPage); // program object
    plugin.addURI(PREFIX + ':episode:(.*)', episodePage); // episode object

    // URI functions
    function superCategoryURI(category) {
        return PREFIX + ':supercat:' + showtime.JSONEncode(category);
    }
    function categoryURI(category) {
        return PREFIX + ':category:' + showtime.JSONEncode(category);
    }
    function channelURI(channel) {
        return PREFIX + ':channel:' + showtime.JSONEncode(channel);
    }
    function stationURI(station){
        return PREFIX + ':station:' + showtime.JSONEncode(station);
    }
    function programURI(program) {
        return PREFIX + ':program:' + showtime.JSONEncode(program);
    }
    function episodeURI(episode) {
        return PREFIX + ':episode:' + showtime.JSONEncode(episode);
    }

    // ==========================================================================
    // CONTROLLERS
    // ==========================================================================

    /**
     * Define the start page
     * @param page
     */
    function startPage(page) {
        // Add categories
//        page.appendItem('', 'separator', {title: 'Categorías'});
        for (var i = 0; i < CATEGORIES.length; i++) {
            var category = CATEGORIES[i];
            category.page = 1;
            var uri = (category.id in SUBCATEGORIES) ? superCategoryURI(category) : categoryURI(category);
            page.appendItem(uri, 'directory', {title: category.title});
        }

        page.type = 'directory';
        page.contents = 'items';
        page.metadata.logo = LOGO;
        page.metadata.title = TITLE;
        page.loading = false;
    }

    /**
     * Define a super category page
     * Display the list of subcategories
     *
     * @param page
     * @param category
     */
    function superCategoryPage(page, category) {
        category = showtime.JSONDecode(category);

        // Add subcategories
        var subcategories = SUBCATEGORIES[category.id]
        for (var i = 0; i < subcategories.length; i++) {
            var subcategory = subcategories[i];
            page.appendItem(categoryURI(subcategory), 'directory', {title: subcategory.title});
        }

        page.type = 'directory';
        page.contents = 'items';
        page.metadata.logo = LOGO;
        page.metadata.title = category.title;
        page.loading = false;
    }

    /**
     * Define a program category page
     *
     * @param page
     * @param category
     */
    function categoryPage(page, category) {
        category = showtime.JSONDecode(category);

        var pag = 1;
        function paginator() {
            var html = getCategoryHTML(category, pag++);
            var programs = parsePrograms(html);
            displayPrograms(page, programs);
            return programs.length != 0;
        }

        paginator();
        page.paginator = paginator;
        page.type = 'directory';
        page.contents = 'items';
        page.metadata.logo = LOGO;
        page.metadata.title = category.title;
        page.loading = false;
    }

    /**
     * Define a TV channel page
     *
     * @param page
     * @param channel
     */
    function channelPage(page, channel) {
        page.type = 'directory';
        page.contents = 'contents';
        page.metadata.title = CHANNELS[channel];
        page.loading = false;
    }

    /**
     * Define a Radio station page
     *
     * @param page
     * @param station
     */
    function stationPage(page, station) {
        page.type = 'directory';
        page.contents = 'contents';
        page.metadata.title = STATIONS[station];
        page.loading = false;
    }

    /**
     * Define a program page
     *
     * @param page
     * @param {string} program encoded program object
     */
    function programPage(page, program) {
        program = showtime.JSONDecode(program);

        var pag = 1;
        function paginator() {
            var html = getProgramHTML(program, pag++);
            var episodes = parseEpisodes(html);
            displayEpisodes(page, episodes);
            return episodes.length != 0;
        }

        paginator();
        page.paginator = paginator;
        page.type = 'directory';
        page.contents = 'contents';
        page.metadata.title = program.title;
        page.loading = false;
    }

    /**
     * Define a episode page
     * Gets and plays the episode
     *
     * @param page
     * @param episode
     */
    function episodePage(page, episode) {
        episode = showtime.JSONDecode(episode);
        var video = getVideoParams(episode);
        page.type = 'video'; // TODO music sources
        page.source = 'videoparams:' + showtime.JSONEncode(video);
        page.loading = false;
    }

    /**
     * Define a search page
     *
     * @param page
     * @param {string} query
     */
    function searchPage(page, query) {
        var pag = 0;
        page.entries = 0;
        function paginator() {
            var html = getSearchHTML(query, pag++);
            var results = parseResults(html);
            displayEpisodes(page, results);
            page.entries += results.length;
            return results.length != 0;
        }

        paginator();
        page.type = 'directory';
        page.contents = 'ĺist';
        page.paginator = paginator;
        page.loading = false;
    }

    // ==========================================================================
    // MODELS
    // ==========================================================================

    /**
     * Returns the HTML page from a category
     *
     * @param   {object} category
     * @param   {integer} pag
     * @returns {string} HTML page
     */
    function getCategoryHTML(category, pag) {
        var args = {
            order: 1,
            criteria: 'asc',
            pageSize: 50, // not working
            emissionFilter: 'all' // 'emi' TODO showtime option
        };
        var url = BASEURL + '/alacarta/programas/todos/' + category.id + '/' + pag + '/';
        showtime.trace(url);
        return showtime.httpReq(url, {args: args}).toString();
    }

    /**
     * Returns the HTML page from a program
     *
     * @param   {object} program
     * @param   {int} pag
     * @returns {string} HTML page
     */
    function getProgramHTML(program, pag) {
        var args = {
            ctx: program.id,
            pageSize: 50,
            typeFilter: 39816, // full programs
            order: 3, // 3 -> date
            orderCriteria: 'DESC',
            pbq: pag // page number
        };
        return showtime.httpReq(PROGRAM_BASEURL, {args: args}).toString();
    }

    /**
     * Returns the HTML page of the query results
     *
     * @param {string} query
     * @returns {string} HTML page
     */
    function getSearchHTML(query, pag) {
        var args = {q: query, start: pag * 10};
        var url = BASEURL + '/buscador/GoogleServlet';
        showtime.trace('Loading: ' + url + '?q=' + query + '&start=' + (pag * 10), PREFIX);
        return showtime.httpReq(url, {args: args}).toString();
    }

    /**
     * Returns a showtime videoparams object from a episode
     * Uses the PyDownTV API http://www.pydowntv.com/api to obtain the info
     *
     * @param episode
     * @returns {object}
     */
    function getVideoParams(episode) {
        var args = {url: episode.url};
        showtime.trace('Loading: ' + url + '?url=' + episode.url, PREFIX);
        var json = showtime.httpReq(PYDOWNTV_BASEURL, {args: args}).toString();
        json = showtime.JSONDecode(json);
        if (!json.exito) {
            return null; // fail
        }
        var sources = [];
        for (var i = 0; i < json.videos[0].url_video.length; i++) {
            sources.push({url: json.videos[0].url_video[i]});
        }
        return {
            sources     : sources,
            title       : json.titulos[0],
            no_fs_scan  : true,
            canonicalUrl: episodeURI(episode)
        };
    }

    // ==========================================================================
    // HTML PARSERS
    // ==========================================================================

    /**
     * Parses the category html page and returns the list of programs
     *
     * @param   {string} html
     * @returns {Array} programs
     */
    function parsePrograms(html) {
        var init = html.indexOf('<div class="ContentTabla">'); // Begins programs table
        init = html.indexOf('<li class="odd">', init); // First program
        var end = html.indexOf('<!-- Fin modulo todos los programas -->', init); // Ends program table
        html = html.slice(init, end);
        html = html.replace(/[\n\r]/g, ' '); // Remove break lines

        // Split and parse programs
        var programs = [];
        var split = html.split(/<li class="odd">|<li class="even">/);
        for (var i = 0; i < split.length; i++) {
            var item = split[i];
            var program = {};
            var match = item.match(REGEX_PROGRAM);
            if (match) {
                // Add the mathed program to the list
                program.id = match[1];
                program.url = match[2];
                program.title = match[3];
                program.date = match[4];
                program.description = match[5];
                programs.push(program);
            }
        }
        return programs;
    }

    /**
     * Parses the program html page and returns the list of episodes
     *
     * @param   {string} html
     * @returns {Array} episodes
     */
    function parseEpisodes(html) {
        var init = html.indexOf('<div class="ContentTabla">'); // Begins episodes table
        init = html.indexOf('<li class="odd">', init); // First program
        var end = html.indexOf('<div class="FooterTabla">', init); // Ends episodes table
        html = html.slice(init, end);
        html = html.replace(/[\n\r]/g, ' '); // Remove break lines

        // Split and parse episodes
        var episodes = [];
        var split = html.split(/<li class="odd">|<li class="even">/);
        for (var i = 0; i < split.length; i++) {
            var item = split[i];
            var episode = {};
            var match = item.match(REGEX_EPISODE);
            if (match) {
                // Add the mathed program to the list
                episode.id = match[1];
                episode.url = fullURL(match[2]);
                episode.title = match[3];
                episode.duration = match[4];
                episode.date = match[5];
                episode.description = match[6];
                episodes.push(episode);
            }
        }
        return episodes;
    }

    /**
     * Parses the search html page and return the list of results
     *
     * @param html
     * @returns {Array}
     */
    function parseResults(html) {
        var init = html.indexOf('<div class="sresult">'); // Begins results list
        var end = html.indexOf('<div class="col a40">');
        html = html.slice(init, end);
        html = html.replace(/[\n\r]/g, ' '); // Remove break lines

        // Split and parse results
        var results = [];
        var split = html.split(/<div class="sresult">/);
        for (var i = 0; i < split.length; i++) {
            var item = split[i];
            var result = {};
            var match = item.match(REGEX_RESULT);
            if (match) {
                // Add the matched result to the list
                result.title = match[1];
                result.url = fullURL(match[2]);
                result.icon = match[3];
                result.date = match[4];
                result.description = match[5];
                result.duration = null;
                results.push(result);
            }
        }
        return results;
    }

    /**
     * Returns the full path of URLs
     * Add the BASEURL to relatives paths
     *
     * @param {string} url
     * @returns {string} url full path
     */
    function fullURL(url) {
        return url.indexOf(BASEURL) == -1 ? BASEURL + url : url;
    }

    // ==========================================================================
    // VIEWS
    // ==========================================================================

    /**
     * Display the program list
     *
     * @param page
     * @param {Array} programs
     */
    function displayPrograms(page, programs) {
        for (var i = 0; i < programs.length; i++) {
            var program = programs[i];
            var metadata = getProgramMetadata(program);
            page.appendItem(programURI(program), 'video', metadata); // I think only video supports description
        }
    }

    /**
     * Display the episode list
     *
     * @param page
     * @param {Array} episodes
     */
    function displayEpisodes(page, episodes) {
        for (var i = 0; i < episodes.length; i++) {
            var episode = episodes[i];
            page.appendItem(episodeURI(episode), 'video', getEpisodeMetadata(episode));
        }
    }

    // ==========================================================================
    // VIEW HELPERS
    // ==========================================================================

    /**
     * Returns a metadata object for a given program
     *
     * @param   {object} program
     * @returns {object} showtime item metadata
     */
    function getProgramMetadata(program) {
        var title = program.title;

        var desc = '<font size="4">' + 'Último: ' + '</font>';
        desc += '<font size="4" color="#daa520">' + program.date + '</font>\n';
        desc += program.description;

        return {
            title: new showtime.RichText(title),
            description: new showtime.RichText(desc)
        };
    }

    /**
     * Returns a metadata object for a given episode
     *
     * @param   {object} episode
     * @returns {object} showtime item metadata
     */
    function getEpisodeMetadata(episode) {
        var title = episode.title;
        title = title.replace('<em>', '<font color="#daa520">');
        title = title.replace('</em>', '</font>');

        var desc = '<font size="4">' + 'Fecha: ' + '</font>';
        desc += '<font size="4" color="#daa520">' + episode.date + '</font>\n';
        desc += episode.description;

        var metadata = {
            title: new showtime.RichText(title),
            description: new showtime.RichText(desc)
        };

        if (episode.duration) {
            metadata.duration = dur2sec(episode.duration);
        }

        if (episode.icon) {
            metadata.icon = episode.icon;
        }

        return metadata;
    }

    /**
     * Convert a string duration into a number of seconds
     *
     * @param {string} duration in [[HH:]MM:]SS format
     * @returns {number}
     */
    function dur2sec(duration) {
        var seconds = 0;
        var split = duration.split(':');
        switch (split.length) {
            case 3: // hours
                seconds += parseInt(split[split.length-3]) * 3600; // fall-through
            case 2: // minutes
                seconds += parseInt(split[split.length-2]) * 60; // fall-through
            case 1: // seconds
                seconds += parseInt(split[split.length-1]);
        }
        return seconds;
    }

})(this);

// http://img.irtve.es/i/?w=&i=1378896964842.jpg
// http://img.irtve.es/imagenes/cuentame-como-paso/1389887626950.jpg
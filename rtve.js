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
    const RTVE_BASEURL = 'http://www.rtve.es';
    const PROGRAM_BASEURL = 'http://www.rtve.es/alacarta/interno/contenttable.shtml';
    const VIDEOS_BASEURL = 'http://mvod.lvlt.rtve.es';
    const MADVIEO_BASEURL = 'http://studio.themadvideo.com/api/videos/';
    const DESCARGAVIDEOS_BASEURL = 'http://www.descargavideos.tv';
    const VIDEOINFO_BASEURL = 'http://www.rtve.es/drmn/embed/video/';
    const RTVE_LOGO = 'http://img.irtve.es/css/rtve.commons/rtve.header.footer/i/logoRTVEes.png';
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
    const REGEXP_PROGRAM = /"col_tit".*?id *= *"([0-9]*)".*?href *= *"(.*?)".*?>(.*?)<\/a.*"col_fec".*?>(.*?)<.*"detalle".*?>(.*?)</;
    const REGEXP_VIDEO = /"col_tit".*?id *= *"([0-9]*)".*?href *= *"(.*?)".*?>(.*?)<\/a.*"col_dur".*?>(.*?)<.*"col_fec".*?>(.*?)<.*"detalle".*?>(.*?)</;

    // Create the showtime service and link to the statPage
    plugin.createService(TITLE, PREFIX + ':start', 'video', true, RTVE_LOGO);

    // Map URIs and functions
    plugin.addURI(PREFIX + ':start', startPage);
    plugin.addURI(PREFIX + ':channel:(.*)', channelPage); // channel object
    plugin.addURI(PREFIX + ':station:(.*)', stationPage); // radio object
    plugin.addURI(PREFIX + ':supercat:(.*)', superCategoryPage); //category object
    plugin.addURI(PREFIX + ':category:(.*)', categoryPage); //category object
    plugin.addURI(PREFIX + ':program:(.*)', programPage); // program object
    plugin.addURI(PREFIX + ':video:(.*)', videoPage); // video object

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
    function videoURI(video) {
        return PREFIX + ':video:' + showtime.JSONEncode(video);
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
        page.metadata.logo = RTVE_LOGO;
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
            subcategory.page = 1;
            page.appendItem(categoryURI(subcategory), 'directory', {title: subcategory.title});
        }

        page.type = 'directory';
        page.contents = 'items';
        page.metadata.logo = RTVE_LOGO;
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
        var html = getCategoryHTML(category);
        var programs = parsePrograms(html);

        (category.page <= 1) || displayPrevious(page, category, categoryURI);
        displayPrograms(page, programs);
        displayNext(page, category, categoryURI);

        page.type = 'directory';
        page.contents = 'items';
        page.metadata.logo = RTVE_LOGO;
        page.metadata.title = category.title + ' (' + category.page + ')';
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
        var html = getProgramHTML(program);
        var videos = parseVideos(html);

        (program.page <= 1) || displayPrevious(page, program, programURI);
        displayVideos(page, videos);
        displayNext(page, program, programURI);

        page.type = 'directory';
        page.contents = 'contents';
        page.metadata.title = program.title + ' (' + program.page + ')';
        page.loading = false;
    }

    /**
     * Define a video page
     * Gets and plays the video
     *
     * @param page
     * @param video
     */
    function videoPage(page, video) {
        video = showtime.JSONDecode(video);
        var file = getVideoFile(video);
        var ext = file.split(':').pop();
        showtime.print('Playing: ' + file);
        var videoParams = {
            title: video.title,
            sources: [{url: file}]
        };
        page.type = (ext === 'mp3') ? 'music' : 'video';
        page.source = file;//'videoparams:' + showtime.JSONEncode(videoParams);
        page.loading = false;
    }

    // ==========================================================================
    // MODELS
    // ==========================================================================

    /**
     * Returns the HTML page from a category
     *
     * @param   {object} category
     * @returns {string} HTML page
     */
    function getCategoryHTML(category) {
        var args = {
            order: 1,
            criteria: 'asc',
            pageSize: 50, // not working
            emissionFilter: 'all' // 'emi' TODO showtime option
        };
        var url = RTVE_BASEURL + '/alacarta/programas/todos/' + category.id + '/' + category.page + '/';
        showtime.print(url);
        return showtime.httpReq(url, {args: args}).toString();
    }

    /**
     * Returns the HTML page from a program
     *
     * @param   {object} program
     * @returns {string} HTML page
     */
    function getProgramHTML(program) {
        var args = {
            ctx: program.id,
            pageSize: 50,
            typeFilter: 39816, // full programs
            order: 3, // 3 -> date
            orderCriteria: 'DESC',
            pbq: program.page // page number
        };
        return showtime.httpReq(PROGRAM_BASEURL, {args: args}).toString();
    }

    function getVideoFile(video) {
        var url = RTVE_BASEURL + video.url;
        var html = showtime.httpReq(url).toString();
        // Try with madvideo
        var match = html.match('<iframe id="visor(.*)" width');
        if (match) {
            url = MADVIEO_BASEURL + match[1] + '/player_data';
            html = showtime.httpReq(url).toString();
            var init = html.indexOf('<src>' + VIDEOS_BASEURL) + 5;
            var end = html.indexOf('</src>', init);
            var video_uri = html.slice(init, end);
            return video_uri;
        }
        // Try with descargavideos
        var args = {modo: 1, web: url};
        html = showtime.httpReq(DESCARGAVIDEOS_BASEURL, {args: args}).toString();
        var ini = html.indexOf(VIDEOS_BASEURL);
        var end = html.indexOf("'", ini);
        html = html.slice(ini, end);
        return html;
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
            var match = item.match(REGEXP_PROGRAM);
            if (match) {
                // Add the mathed program to the list
                program.id = match[1];
                program.url = match[2];
                program.title = match[3];
                program.date = match[4];
                program.description = match[5];
                program.page = 1; // workaround to save the page number
                programs.push(program);
            }
        }
        return programs;
    }

    /**
     * Parses the program html page and returns the list of videos
     *
     * @param   {string} html
     * @returns {Array} videos
     */
    function parseVideos(html) {
        var init = html.indexOf('<div class="ContentTabla">'); // Begins videos table
        init = html.indexOf('<li class="odd">', init); // First program
        var end = html.indexOf('<div class="FooterTabla">', init); // Ends videos table
        html = html.slice(init, end);
        html = html.replace(/[\n\r]/g, ' '); // Remove break lines

        // Split and parse videos
        var videos = [];
        var split = html.split(/<li class="odd">|<li class="even">/);
        for (var i = 0; i < split.length; i++) {
            var item = split[i];
            var video = {};
            var match = item.match(REGEXP_VIDEO);
            if (match) {
                // Add the mathed program to the list
                video.id = match[1];
                video.url = match[2];
                video.title = match[3];
                video.duration = match[4];
                video.date = match[5];
                video.description = match[6];
                videos.push(video);
            }
        }
        return videos;
    }

    // ==========================================================================
    // VIEWS
    // ==========================================================================

    function displayPrevious(page, item, callbackURI) {
        item.page--;
        page.appendItem(callbackURI(item), 'directory', {title: 'Página anterior'});
        item.page++;
    }

    function displayNext(page, item, callbackURI) {
        item.page++;
        page.appendItem(callbackURI(item), 'directory', {title: 'Página siguiente'});
        item.page--;
    }

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
     * Display the video list
     *
     * @param page
     * @param {Array} videos
     */
    function displayVideos(page, videos) {
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            page.appendItem(videoURI(video), 'video', getVideoMetadata(video));
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
     * Returns a metadata object for a given video
     *
     * @param   {object} video
     * @returns {object} showtime item metadata
     */
    function getVideoMetadata(video) {
        var title = video.title;
        title = title.replace('<em>', '<font color="#daa520">');
        title = title.replace('</em>', '</font>');

        var desc = '<font size="4">' + 'Fecha: ' + '</font>';
        desc += '<font size="4" color="#daa520">' + video.date + '</font>\n';
        desc += video.description;

        return {
            title: new showtime.RichText(title),
            description: new showtime.RichText(desc),
            duration: dur2sec(video.duration)
        };

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
<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* relation/check_relations.twig */
class __TwigTemplate_8f7d8f278e9eb7fe0189bce83d8b4950 extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        yield "<div class=\"container\">
  <h1 class=\"my-3\">
    ";
yield _gettext("phpMyAdmin configuration storage");
        // line 4
        yield "    ";
        yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "phpmyadmin-configuration-storage");
        yield "
  </h1>

  ";
        // line 7
        if ((null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "db", [], "any", false, false, false, 7))) {
            // line 8
            yield "    <p>
      ";
yield _gettext("Configuration of pmadb…");
            // line 10
            yield "      <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
            yield "</strong></span>
      ";
            // line 11
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "phpmyadmin-configuration-storage");
            yield "
    </p>
    <p>
      ";
yield _gettext("General relation features");
            // line 15
            yield "      <span class=\"text-danger\">";
yield _gettext("Disabled");
            yield "</span>
    </p>
    ";
            // line 17
            if (($context["zero_conf"] ?? null)) {
                // line 18
                yield "      ";
                if ((($context["db"] ?? null) == "")) {
                    // line 19
                    yield "        ";
                    $___internal_parse_0_ = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                        // line 20
                        yield "          ";
yield _gettext("%sCreate%s a database named '%s' and setup the phpMyAdmin configuration storage there.");
                        // line 21
                        yield "        ";
                        return; yield '';
                    })())) ? '' : new Markup($tmp, $this->env->getCharset());
                    // line 19
                    yield $this->env->getFilter('notice')->getCallable()(Twig\Extension\CoreExtension::sprintf($___internal_parse_0_, (((("<a href=\"" . PhpMyAdmin\Url::getFromRoute("/check-relations")) . "\" data-post=\"") . PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "create_pmadb" => true, "goto" => PhpMyAdmin\Url::getFromRoute("/database/operations")])) . "\">"), "</a>", ($context["config_storage_database_name"] ?? null)));
                    // line 22
                    yield "      ";
                } else {
                    // line 23
                    yield "        ";
                    $___internal_parse_1_ = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                        // line 24
                        yield "          ";
yield _gettext("%sCreate%s the phpMyAdmin configuration storage in the current database.");
                        // line 25
                        yield "        ";
                        return; yield '';
                    })())) ? '' : new Markup($tmp, $this->env->getCharset());
                    // line 23
                    yield $this->env->getFilter('notice')->getCallable()(Twig\Extension\CoreExtension::sprintf($___internal_parse_1_, (((("<a href=\"" . PhpMyAdmin\Url::getFromRoute("/check-relations")) . "\" data-post=\"") . PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "fixall_pmadb" => true, "goto" => PhpMyAdmin\Url::getFromRoute("/database/operations")])) . "\">"), "</a>"));
                    // line 26
                    yield "      ";
                }
                // line 27
                yield "    ";
            }
            // line 28
            yield "  ";
        } else {
            // line 29
            yield "    ";
            if ((( !CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "allworks", [], "any", false, false, false, 29) && ($context["zero_conf"] ?? null)) && ($context["are_config_storage_tables_defined"] ?? null))) {
                // line 30
                yield "      ";
                $___internal_parse_2_ = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                    // line 31
                    yield "        ";
yield _gettext("%sCreate%s missing phpMyAdmin configuration storage tables.");
                    // line 32
                    yield "      ";
                    return; yield '';
                })())) ? '' : new Markup($tmp, $this->env->getCharset());
                // line 30
                yield $this->env->getFilter('notice')->getCallable()(Twig\Extension\CoreExtension::sprintf($___internal_parse_2_, (((("<a href=\"" . PhpMyAdmin\Url::getFromRoute("/check-relations")) . "\" data-post=\"") . PhpMyAdmin\Url::getCommon(["db" => ($context["db"] ?? null), "fix_pmadb" => true, "goto" => PhpMyAdmin\Url::getFromRoute("/database/operations")])) . "\">"), "</a>"));
                // line 33
                yield "    ";
            }
            // line 34
            yield "
    <table class=\"table table-striped\">
      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['pmadb']</code>
          ";
            // line 39
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_pmadb");
            yield "
        </th>
        <td class=\"text-end\">
          <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
            // line 42
            yield "</strong></span>
        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['relation']</code>
          ";
            // line 50
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_relation");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 53
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "relation", [], "any", false, false, false, 53))) {
                // line 54
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 56
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 58
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("General relation features:");
            // line 63
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "relwork", [], "any", false, false, false, 63)) {
                // line 64
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 66
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 68
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['table_info']</code>
          ";
            // line 75
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_table_info");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 78
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "table_info", [], "any", false, false, false, 78))) {
                // line 79
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 81
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 83
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Display features:");
            // line 88
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "displaywork", [], "any", false, false, false, 88)) {
                // line 89
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 91
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 93
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['table_coords']</code>
          ";
            // line 100
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_table_coords");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 103
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "table_coords", [], "any", false, false, false, 103))) {
                // line 104
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 106
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 108
            yield "        </td>
      </tr>
      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['pdf_pages']</code>
          ";
            // line 113
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_pdf_pages");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 116
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "pdf_pages", [], "any", false, false, false, 116))) {
                // line 117
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 119
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 121
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Designer and creation of PDFs:");
            // line 126
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "pdfwork", [], "any", false, false, false, 126)) {
                // line 127
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 129
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 131
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['column_info']</code>
          ";
            // line 138
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_column_info");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 141
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "column_info", [], "any", false, false, false, 141))) {
                // line 142
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 144
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 146
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Displaying column comments:");
            // line 151
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "commwork", [], "any", false, false, false, 151)) {
                // line 152
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 154
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 156
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Browser transformation:");
            // line 161
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "mimework", [], "any", false, false, false, 161)) {
                // line 162
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 164
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 166
            yield "        </td>
      </tr>
      ";
            // line 168
            if ((CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "commwork", [], "any", false, false, false, 168) &&  !CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "mimework", [], "any", false, false, false, 168))) {
                // line 169
                yield "        <tr>
          <td colspan=\"2\" class=\"text-end\">
            <span class=\"text-danger\">
              ";
yield _gettext("Please see the documentation on how to update your column_info table.");
                // line 173
                yield "              ";
                yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_column_info");
                yield "
            </span>
          </td>
        </tr>
      ";
            }
            // line 178
            yield "      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['bookmarktable']</code>
          ";
            // line 183
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_bookmarktable");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 186
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "bookmark", [], "any", false, false, false, 186))) {
                // line 187
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 189
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 191
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Bookmarked SQL query:");
            // line 196
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "bookmarkwork", [], "any", false, false, false, 196)) {
                // line 197
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 199
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 201
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['history']</code>
          ";
            // line 208
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_history");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 211
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "history", [], "any", false, false, false, 211))) {
                // line 212
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 214
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 216
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("SQL history:");
            // line 221
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "historywork", [], "any", false, false, false, 221)) {
                // line 222
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 224
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 226
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['recent']</code>
          ";
            // line 233
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_recent");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 236
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "recent", [], "any", false, false, false, 236))) {
                // line 237
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 239
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 241
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Persistent recently used tables:");
            // line 246
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "recentwork", [], "any", false, false, false, 246)) {
                // line 247
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 249
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 251
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['favorite']</code>
          ";
            // line 258
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_favorite");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 261
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "favorite", [], "any", false, false, false, 261))) {
                // line 262
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 264
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 266
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Persistent favorite tables:");
            // line 271
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "favoritework", [], "any", false, false, false, 271)) {
                // line 272
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 274
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 276
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['table_uiprefs']</code>
          ";
            // line 283
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_table_uiprefs");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 286
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "table_uiprefs", [], "any", false, false, false, 286))) {
                // line 287
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 289
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 291
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Persistent tables' UI preferences:");
            // line 296
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "uiprefswork", [], "any", false, false, false, 296)) {
                // line 297
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 299
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 301
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['tracking']</code>
          ";
            // line 308
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_tracking");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 311
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "tracking", [], "any", false, false, false, 311))) {
                // line 312
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 314
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 316
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Tracking:");
            // line 321
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "trackingwork", [], "any", false, false, false, 321)) {
                // line 322
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 324
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 326
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['userconfig']</code>
          ";
            // line 333
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_userconfig");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 336
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "userconfig", [], "any", false, false, false, 336))) {
                // line 337
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 339
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 341
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("User preferences:");
            // line 346
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "userconfigwork", [], "any", false, false, false, 346)) {
                // line 347
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 349
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 351
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['users']</code>
          ";
            // line 358
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_users");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 361
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "users", [], "any", false, false, false, 361))) {
                // line 362
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 364
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 366
            yield "        </td>
      </tr>
      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['usergroups']</code>
          ";
            // line 371
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_usergroups");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 374
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "usergroups", [], "any", false, false, false, 374))) {
                // line 375
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 377
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 379
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Configurable menus:");
            // line 384
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "menuswork", [], "any", false, false, false, 384)) {
                // line 385
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 387
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 389
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['navigationhiding']</code>
          ";
            // line 396
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_navigationhiding");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 399
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "navigationhiding", [], "any", false, false, false, 399))) {
                // line 400
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 402
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 404
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Hide/show navigation items:");
            // line 409
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "navwork", [], "any", false, false, false, 409)) {
                // line 410
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 412
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 414
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['savedsearches']</code>
          ";
            // line 421
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_savedsearches");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 424
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "savedsearches", [], "any", false, false, false, 424))) {
                // line 425
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 427
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 429
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Saving Query-By-Example searches:");
            // line 434
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "savedsearcheswork", [], "any", false, false, false, 434)) {
                // line 435
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 437
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 439
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['central_columns']</code>
          ";
            // line 446
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_central_columns");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 449
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "central_columns", [], "any", false, false, false, 449))) {
                // line 450
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 452
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 454
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Managing central list of columns:");
            // line 459
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "centralcolumnswork", [], "any", false, false, false, 459)) {
                // line 460
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 462
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 464
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['designer_settings']</code>
          ";
            // line 471
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_designer_settings");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 474
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "designer_settings", [], "any", false, false, false, 474))) {
                // line 475
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 477
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 479
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Remembering designer settings:");
            // line 484
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "designersettingswork", [], "any", false, false, false, 484)) {
                // line 485
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 487
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 489
            yield "        </td>
      </tr>
      <tr><td colspan=\"2\">&nbsp;</td></tr>

      <tr>
        <th class=\"text-start\" scope=\"row\">
          <code>\$cfg['Servers'][\$i]['export_templates']</code>
          ";
            // line 496
            yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_export_templates");
            yield "
        </th>
        <td class=\"text-end\">
          ";
            // line 499
            if ( !(null === CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "export_templates", [], "any", false, false, false, 499))) {
                // line 500
                yield "            <span class=\"text-success\"><strong>";
yield _pgettext("Correctly working", "OK");
                yield "</strong></span>
          ";
            } else {
                // line 502
                yield "            <span class=\"text-danger\"><strong>";
yield _gettext("not OK");
                yield "</strong></span>
          ";
            }
            // line 504
            yield "        </td>
      </tr>
      <tr>
        <td colspan=\"2\" class=\"text-end\">
          ";
yield _gettext("Saving export templates:");
            // line 509
            yield "          ";
            if (CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "exporttemplateswork", [], "any", false, false, false, 509)) {
                // line 510
                yield "            <span class=\"text-success\">";
yield _gettext("Enabled");
                yield "</span>
          ";
            } else {
                // line 512
                yield "            <span class=\"text-danger\">";
yield _gettext("Disabled");
                yield "</span>
          ";
            }
            // line 514
            yield "        </td>
      </tr>
    </table>

    ";
            // line 518
            if ( !CoreExtension::getAttribute($this->env, $this->source, ($context["relation_parameters"] ?? null), "allworks", [], "any", false, false, false, 518)) {
                // line 519
                yield "      <p>";
yield _gettext("Quick steps to set up advanced features:");
                yield "</p>

      <ul>
        <li>
          ";
                // line 523
                yield Twig\Extension\CoreExtension::sprintf(_gettext("Create the needed tables with the <code>%screate_tables.sql</code>."), $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["sql_dir"] ?? null)));
                yield "
          ";
                // line 524
                yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "linked-tables");
                yield "
        </li>
        <li>
          ";
yield _gettext("Create a pma user and give access to these tables.");
                // line 528
                yield "          ";
                yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("config", "cfg_Servers_controluser");
                yield "
        </li>
        <li>
          ";
yield _gettext("Enable advanced features in configuration file (<code>config.inc.php</code>), for example by starting from <code>config.sample.inc.php</code>.");
                // line 532
                yield "          ";
                yield PhpMyAdmin\Html\MySQLDocumentation::showDocumentation("setup", "quick-install");
                yield "
        </li>
        <li>
          ";
yield _gettext("Re-login to phpMyAdmin to load the updated configuration file.");
                // line 536
                yield "        </li>
      </ul>
    ";
            }
            // line 539
            yield "  ";
        }
        // line 540
        yield "</div>
";
        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "relation/check_relations.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  1161 => 540,  1158 => 539,  1153 => 536,  1145 => 532,  1137 => 528,  1130 => 524,  1126 => 523,  1118 => 519,  1116 => 518,  1110 => 514,  1104 => 512,  1098 => 510,  1095 => 509,  1088 => 504,  1082 => 502,  1076 => 500,  1074 => 499,  1068 => 496,  1059 => 489,  1053 => 487,  1047 => 485,  1044 => 484,  1037 => 479,  1031 => 477,  1025 => 475,  1023 => 474,  1017 => 471,  1008 => 464,  1002 => 462,  996 => 460,  993 => 459,  986 => 454,  980 => 452,  974 => 450,  972 => 449,  966 => 446,  957 => 439,  951 => 437,  945 => 435,  942 => 434,  935 => 429,  929 => 427,  923 => 425,  921 => 424,  915 => 421,  906 => 414,  900 => 412,  894 => 410,  891 => 409,  884 => 404,  878 => 402,  872 => 400,  870 => 399,  864 => 396,  855 => 389,  849 => 387,  843 => 385,  840 => 384,  833 => 379,  827 => 377,  821 => 375,  819 => 374,  813 => 371,  806 => 366,  800 => 364,  794 => 362,  792 => 361,  786 => 358,  777 => 351,  771 => 349,  765 => 347,  762 => 346,  755 => 341,  749 => 339,  743 => 337,  741 => 336,  735 => 333,  726 => 326,  720 => 324,  714 => 322,  711 => 321,  704 => 316,  698 => 314,  692 => 312,  690 => 311,  684 => 308,  675 => 301,  669 => 299,  663 => 297,  660 => 296,  653 => 291,  647 => 289,  641 => 287,  639 => 286,  633 => 283,  624 => 276,  618 => 274,  612 => 272,  609 => 271,  602 => 266,  596 => 264,  590 => 262,  588 => 261,  582 => 258,  573 => 251,  567 => 249,  561 => 247,  558 => 246,  551 => 241,  545 => 239,  539 => 237,  537 => 236,  531 => 233,  522 => 226,  516 => 224,  510 => 222,  507 => 221,  500 => 216,  494 => 214,  488 => 212,  486 => 211,  480 => 208,  471 => 201,  465 => 199,  459 => 197,  456 => 196,  449 => 191,  443 => 189,  437 => 187,  435 => 186,  429 => 183,  422 => 178,  413 => 173,  407 => 169,  405 => 168,  401 => 166,  395 => 164,  389 => 162,  386 => 161,  379 => 156,  373 => 154,  367 => 152,  364 => 151,  357 => 146,  351 => 144,  345 => 142,  343 => 141,  337 => 138,  328 => 131,  322 => 129,  316 => 127,  313 => 126,  306 => 121,  300 => 119,  294 => 117,  292 => 116,  286 => 113,  279 => 108,  273 => 106,  267 => 104,  265 => 103,  259 => 100,  250 => 93,  244 => 91,  238 => 89,  235 => 88,  228 => 83,  222 => 81,  216 => 79,  214 => 78,  208 => 75,  199 => 68,  193 => 66,  187 => 64,  184 => 63,  177 => 58,  171 => 56,  165 => 54,  163 => 53,  157 => 50,  147 => 42,  140 => 39,  133 => 34,  130 => 33,  128 => 30,  124 => 32,  121 => 31,  118 => 30,  115 => 29,  112 => 28,  109 => 27,  106 => 26,  104 => 23,  100 => 25,  97 => 24,  94 => 23,  91 => 22,  89 => 19,  85 => 21,  82 => 20,  79 => 19,  76 => 18,  74 => 17,  68 => 15,  61 => 11,  56 => 10,  52 => 8,  50 => 7,  43 => 4,  38 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "relation/check_relations.twig", "/var/www/html/phpMyAdmin/templates/relation/check_relations.twig");
    }
}

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src="application/assets/showdown.js"></script>
<script type="text/javascript">
var converter = new Showdown.converter();

$(function() {
  $.ajax({
      url: "CHANGELOG.md",
      success: function(data) {
          $("#changelog").html(converter.makeHtml(data));
      },
      error: function(xhr, ajaxOptions, thrownError) {
          //alert(xhr.status + ' - ' + thrownError);
          loadContent('error');
      }
  });
});
</script>

<div id="changelog"></div>

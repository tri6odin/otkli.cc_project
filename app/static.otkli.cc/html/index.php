<?php
//error handler
function closeConnection($errortext){
  header("Access-Control-Allow-Origin: https://otkli.cc");
  http_response_code(400);
  echo '{"detail":"'.$errortext.$_REQUEST['jwt'].$_REQUEST['dir'].$_FILES['userfile']['error'].'"}';
  exit;
}
//check request from main site
function checkInputRequest () {
  if (isset($_REQUEST['jwt']) && isset($_REQUEST['dir']) && $_FILES['userfile']['error']==0) {
    if ($_FILES['userfile']['size'] < 15000000) {
      $finfo = finfo_open(FILEINFO_MIME_TYPE);
      $filetype = finfo_file($finfo, $_FILES['userfile']["tmp_name"]);
      finfo_close($finfo);
      if ($filetype == 'image/png' || $filetype == 'image/jpeg') {
        $result=[
          'jwt' => $_REQUEST['jwt'],
          'dir' => $_REQUEST['dir'],
          'file' => $_FILES['userfile']
        ];
      } else {
          closeConnection('filetype error');
      }
    } else {
        closeConnection('filesize error');
    }
  } else {
      closeConnection('missing param');
  }
  return $result;
}
//check jwt token
function checkJWTviaAPI($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    if(curl_exec($ch) === false){
      closeConnection('api server error');
    } else {
      $curl_body = curl_exec($ch);
      $curl_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      $result = [
        'status' => $curl_status,
        'body' => $curl_body
      ];
      curl_close($ch);
      return $result;
    }
}
//full request check, return valid tmpname, dir and filetype
function fullCheck(){
  $userResult = checkInputRequest ();
  $apiresult = checkJWTviaAPI ('https://api.otkli.cc:8080/v1.0/utils/jwt-decode/?jwt='.$userResult['jwt']);
  if ($apiresult['status']==200) {
    $jsonBody = json_decode($apiresult['body'],true);
    switch ($jsonBody['utype']) {
      case "CUS":
        switch ($userResult['dir']) {
          case "profile":
            $dir = "profile";
            break;
          default:
            closeConnection('invalid dir');
        }
        break;
      case "ADM":
        switch ($userResult['dir']) {
          case "profile":
            $dir = "profile";
            break;
          case "company":
            $dir = "company";
            break;
          default:
            closeConnection('invalid dir');
        }
        break;
      case "HR":
        switch ($userResult['dir']) {
          case "profile":
            $dir = "profile";
            break;
          case "company":
            $dir = "company";
            break;
          default:
            closeConnection('invalid dir');
        }
        break;
      default:
        closeConnection('empty utype');
        exit;
    }
  } else {
      closeConnection('jwt error');
  }
  $result = [
    "tmpFileName" => $userResult['file']["tmp_name"],
    "fileType" => $userResult['file']["type"],
    "dir" => $dir
  ];
  return $result;
}
//rotate IMG from iphone
function rotateIMG($img,$tempFileName){
  $exif = exif_read_data($tempFileName);
  if (isset($exif['Orientation'])){
    switch ($exif['Orientation']){
      case 3:
        $img_new = imagerotate($img, 180, imageColorAllocateAlpha($img, 0, 0, 0, 127));
        break;
      case 6:
        $img_new = imagerotate($img, 270, imageColorAllocateAlpha($img, 0, 0, 0, 127));
        break;
      case 8:
        $img_new = imagerotate($img, 90, imageColorAllocateAlpha($img, 0, 0, 0, 127));
        break;
      default:
        $img_new = $img;
        break;
    }
  } else {
    $img_new = $img;
  }
  return $img_new;
}
//proportional resize
function dimResize($wmax,$hmax,$img){
  $w=imagesx($img);
  $h=imagesy($img);
  $ratio = $w/$h;
  if ($wmax<$w || $hmax<$h) {
    if ($w>$h) {
      $width=$wmax;
      $height=ceil($hmax/$ratio);
    } else {
      $width=ceil($wmax*$ratio);
      $height=$hmax;
    }
  } else {
    $width=$w;
    $height=$h;
  }
  $image_p = imagecreatetruecolor($width, $height);
  imagecopyresampled($image_p, $img, 0, 0, 0, 0, $width, $height, $w, $h);
  // ???? imagedestroy($img);
  return $image_p;
}
//create webp
function createWEBP($w,$h,$wold,$hold,$img,$tempBasename){
  $webp = imagecreatetruecolor($w,$h);
  imageAlphaBlending($webp,false);
  imageSaveAlpha($webp,true);
  imagefilledrectangle($webp,0,0,$w - 1,$h - 1,imagecolorallocatealpha($webp,0,0,0,127));
  imagecopyresampled($webp,$img,0,0,0,0,$w,$h,$wold,$hold);
  imagewebp($webp,'temporary/'.$tempBasename,80);
  imagedestroy($webp);
  $tempBasename = 'temporary/'.$tempBasename;
  return $tempBasename;
}
//create path
function createPath($path) {
    if (is_dir($path)) return true;
    $prev_path = substr($path, 0, strrpos($path, '/', -2) + 1 );
    $return = createPath($prev_path);
    return ($return && is_writable($prev_path)) ? mkdir($path, 0774) : false;
}
//file md5 name to path
function md5Path($tempBasename,$rootDir){
  $md5name = md5_file($tempBasename);
  $firstChildDir = substr($md5name, 0, 1);
  $secondChildDir = substr($md5name, 1,2);
  $fileName = substr($md5name, 3).".webp";
  $dirStructure = "webp/".$rootDir."/".$firstChildDir."/".$secondChildDir."/";
  $fullpath = $dirStructure.$fileName;

  createPath($dirStructure);
  if (!copy($tempBasename, $fullpath)) {
      closeConnection("неудалось скопировать файл");
  } else {
    unlink($tempBasename);
    echo '{"url":"'.$fullpath.'"}';
    exit;
  }
}


function saveWebP($filedata){
  //new max img size
  $wmax = 1080;
  $hmax = 1080;
  $tempFileName = $filedata['tmpFileName'];
  $tempBasename = basename($filedata['tmpFileName']).'.webp';
  switch ($filedata['fileType']) {
    case "image/png":
      $img = imagecreatefrompng($tempFileName);
      $img = rotateIMG($img,$tempFileName);
      break;
    case "image/jpeg":
      $img = imagecreatefromjpeg($tempFileName);
      $img = rotateIMG($img,$tempFileName);
      break;
  }
  $newImg=dimResize($wmax,$hmax,$img);
  $tempBasename = createWEBP(imagesx($newImg),imagesy($newImg),imagesx($img),imagesy($img),$img,$tempBasename);
  md5Path($tempBasename,$filedata['dir']);
  imagedestroy($img);
  imagedestroy($newImg);
}
saveWebP(fullCheck());


?>

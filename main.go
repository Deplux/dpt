package main

import (
	"archive/zip"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/briandowns/spinner"
	. "github.com/logrusorgru/aurora"
	"github.com/manifoldco/promptui"
	"github.com/mattn/go-colorable"
)

type MetaData struct {
	Name string
	Path struct {
		Docker string
		Ignore string
	}
}

func init() {
	log.SetOutput(colorable.NewColorableStdout())
	log.SetFlags(0)
}

func main() {
	items := []string{
		"Dockerfile 생성 - 호스팅을 위한 도커 설정을 진행합니다",
		"zip 압축파일 생성 - 호스팅을 업로드 하기 위해 압축파일을 생성합니다",
	}

	log.Print(Gray(10, "Deplux Tools v2.0"))

	prompt := promptui.Select{
		HideHelp: true,
		Items:    items,
		Label:    "진행할 작업을 선택하세요 (화살표와 엔터로 선택)",
	}

	_, result, err := prompt.Run()

	if err != nil {
		log.Print(Red("아무 작업도 선택되지 않았습니다"))
		return
	}

	if result == items[0] {
		createDocker()
	} else if result == items[1] {
		packHosting()
	}
}

func createDocker() {
	baseURL := "https://raw.githubusercontent.com/Deplux/dpt-resolver/main"

	spin := spinner.New(spinner.CharSets[43], 100*time.Millisecond)
	spin.Suffix = " - GitHub에서 지원하는 Dockerfile 목록을 불러오는 중..."
	spin.Start()

	res, err := http.Get(baseURL + "/metadata.json")

	if err != nil {
		log.Print(Red("Dockerfile 목록을 불러오던 중 오류가 발생했습니다"), err)
		return
	}

	if res.Body != nil {
		defer res.Body.Close()
	}

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Print(Red("Dockerfile 목록을 불러오던 중 오류가 발생했습니다"), err)
		return
	}

	var metadata []MetaData

	err = json.Unmarshal(body, &metadata)
	if err != nil {
		log.Print(Red("Dockerfile 목록을 불러오던 중 오류가 발생했습니다"), err)
		return
	}

	spin.Stop()
	items := []string{}

	for i := range metadata {
		items = append(items, metadata[i].Name)
	}

	prompt := promptui.Select{
		HideHelp: true,
		Items:    items,
		Label:    "호스팅 종류를 선택해 주세요 (화살표와 엔터로 선택)",
	}

	_, result, err := prompt.Run()

	if err != nil {
		log.Print(Red("아무 종류도 선택되지 않았습니다"))
		return
	}

	path, err := os.Getwd()
	if err != nil {
		log.Print(Red("디렉터리 정보를 불러오던 중 오류가 발생했습니다"), err)
		return
	}

	for i := range metadata {
		if metadata[i].Name == result {
			prompt := promptui.Prompt{
				Label:     "GitHub에서 " + metadata[i].Name + " 용 Dockerfile을 다운로드합니다. 계속하시겠습니까",
				IsConfirm: true,
				Default:   "y",
			}

			_, err := prompt.Run()
			if err != nil {
				log.Print(Red("취소되었습니다"), err)
				return
			}

			spin.Suffix = " - Dockerfile 적용 중..."
			spin.Restart()

			DownloadFile(path+"/.dockerignore", baseURL+metadata[i].Path.Ignore)
			DownloadFile(path+"/Dockerfile", baseURL+metadata[i].Path.Docker)

			spin.Stop()
			log.Print(Cyan(metadata[i].Name), " 용 Dockerfile이 적용 되었습니다! Happy coding!")
			return
		}
	}
}

func packHosting() {
	cwd, err := os.Getwd()
	if err != nil {
		log.Print(Red("디렉터리 정보를 불러오던 중 오류가 발생했습니다"), err)
		return
	}

	prompt := promptui.Prompt{
		Label:     "에플리케이션의 루트가 " + cwd + "가 맞는지 확인해 주세요. 압축을 진행할까요",
		IsConfirm: true,
		Default:   "y",
	}

	_, err = prompt.Run()
	if err != nil {
		log.Print(Red("취소되었습니다"), err)
		return
	}

	name := time.Now().Format("20060102150405")
	ZipWriter(name)
	log.Print(Cyan("dpt-"+name+".zip"), "에 저장되었습니다! Deplux 봇을 통해 업로드 하실수 있습니다")
}

// DownloadFile will download a url to a local file. It's efficient because it will
// write as it downloads and not load the whole file into memory.
func DownloadFile(filepath string, url string) error {

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	return err
}

func ZipWriter(name string) {
	baseFolder, err := os.Getwd()
	if err != nil {
		log.Print(Red("디렉터리 정보를 불러오던 중 오류가 발생했습니다"), err)
		return
	}

	// Get a Buffer to Write To
	outFile, err := os.Create(baseFolder + "/dpt-" + name + ".zip")
	if err != nil {
		log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
	}
	defer outFile.Close()

	// Create a new zip archive.
	w := zip.NewWriter(outFile)

	// Add some files to the archive.
	addFiles(w, baseFolder+"/", "")

	if err != nil {
		log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
	}

	// Make sure to check the error on Close.
	err = w.Close()
	if err != nil {
		log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
	}
}

func addFiles(w *zip.Writer, basePath, baseInZip string) {
	// Open the Directory
	files, err := ioutil.ReadDir(basePath)
	if err != nil {
		log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
	}

	for _, file := range files {
		if !file.IsDir() {
			if strings.HasPrefix(file.Name(), "dpt-") && strings.HasSuffix(file.Name(), ".zip") {
				continue
			}

			dat, err := ioutil.ReadFile(basePath + file.Name())
			if err != nil {
				log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
			}

			// Add some files to the archive.
			f, err := w.Create(baseInZip + file.Name())
			if err != nil {
				log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
			}
			_, err = f.Write(dat)
			if err != nil {
				log.Print(Red("압축 작업 중 오류가 발생했습니다"), err)
			}
			log.Println(Green(basePath+file.Name()), " 추가됨")
		} else if file.IsDir() {
			if contains([]string{"node_modules", ".git", "dist"}, file.Name()) {
				continue
			}

			newBase := basePath + file.Name() + "/"
			addFiles(w, newBase, baseInZip+file.Name()+"/")
		}
	}
}

func contains(arr []string, str string) bool {
	for _, a := range arr {
		if a == str {
			return true
		}
	}
	return false
}

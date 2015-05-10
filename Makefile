SASSFILES = $(shell find . -maxdepth 5 -type f -name '*.scss')
SOURCES = $(SASSFILES:.scss=.css)

%.css: %.scss
	#hai
	sass  $< > $@

all: $(SOURCES)
	
pull:
	git pull imakinweb master

push:
	git push imakinweb master

commit:
	git commit -a

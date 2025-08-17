"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Icon from "@/components/icon";

export default function VideoEditorClient() {
  const faqData = [
    {
      question: "What is the Free Image to Video AI tool from freegenie3?",
      answer: "The free image to video AI tool from freegenie3 is an innovative platform that uses artificial intelligence to convert static images into dynamic, engaging videos. It's designed to be simple and accessible for everyone, regardless of their video editing experience."
    },
    {
      question: "Is the free image to video AI service truly free?",
      answer: "Yes, our free image to video AI service is completely free to use. We are committed to democratizing access to powerful creative tools, which is why we offer our core functionality without any cost."
    },
    {
      question: "What kind of images can I use with the free image to video AI?",
      answer: "You can use a wide variety of image formats, including JPG, PNG, and more. Our free image to video AI is optimized to work with different image types, from high-resolution photos to simple graphics and illustrations."
    },
    {
      question: "How long does it take to create a video with the free image to video AI?",
      answer: "Our platform is designed for speed and efficiency. The entire process, from uploading your image to generating and downloading your final video, typically takes only a few minutes."
    },
    {
      question: "Can I customize the video created by the free image to video AI?",
      answer: "Absolutely! Our free image to video AI provides a range of customization options. You can choose from various motion presets, add text overlays, include background music, and even adjust the duration of your video."
    },
    {
      question: "What are some uses for the free image to video AI tool?",
      answer: "The applications are limitless! People use our free image to video AI to create engaging social media posts, marketing videos, digital slideshows, animated presentations, and more."
    },
    {
      question: "Do I need any special software or skills to use the free image to video AI?",
      answer: "No, you don't need any special software or skills. Our free image to video AI is a browser-based tool, meaning you can access it from any device with an internet connection."
    },
    {
      question: "How does freegenie3 ensure the quality of the videos created by the free image to video AI?",
      answer: "freegenie3 uses advanced machine learning algorithms and state-of-the-art AI models to ensure the videos are of the highest quality. We continuously refine our technology to produce smooth, professional-looking videos."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Video Editor</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Unleash Your Creativity: The Ultimate Free Image to Video AI Tool
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Convert your images to stunning videos with our <strong>free image to video AI</strong> tool. 
              freegenie3 makes it easy to generate captivating <strong>ai videos</strong> from any photo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/Image-to-Video">
                  <Icon name="RiVideoLine" className="w-5 h-5 mr-2" />
                  Start Creating Videos
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="#features">
                  <Icon name="RiInformationLine" className="w-5 h-5 mr-2" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Introduction */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                In today's visually-driven world, captivating content is key. But what if you have a great idea or a beautiful photo, but lack the skills or time to create a compelling video? 
                That's where a <strong>free image to video AI</strong> tool like freegenie3 comes in. Our platform revolutionizes the way you create <strong>ai videos</strong>. 
                Gone are the days of complex editing software and steep learning curves.
              </p>
            </CardContent>
          </Card>

          {/* Features Section */}
          <section id="features" className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">
              Transforming Still Images: The Power of Free Image to Video AI
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="RiMagicLine" className="w-6 h-6 text-primary" />
                    AI-Powered Motion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI-powered engine analyzes your image, understands its context, and generates seamless motion, 
                    adding a layer of storytelling that was previously impossible without significant effort.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="RiSpeedLine" className="w-6 h-6 text-primary" />
                    Lightning Fast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    With freegenie3, you can effortlessly turn your static images into dynamic, engaging video content in a matter of minutes. 
                    No complex software or steep learning curves required.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">
              Getting Started with Our Free Image to Video AI Generator
            </h2>
            
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Embarking on your creative journey with freegenie3 is incredibly straightforward. Our user-friendly interface is designed to make the process as seamless as possible. 
                    You don't need any prior experience in video editing or AI technology.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="RiUploadLine" className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Upload Image</h3>
                      <p className="text-sm text-muted-foreground">
                        Simply upload the image you want to transform
                      </p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="RiSettings3Line" className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Choose Style</h3>
                      <p className="text-sm text-muted-foreground">
                        Select from various motion presets and effects
                      </p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="RiCpuLine" className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">AI Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI analyzes and creates dynamic motion
                      </p>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="RiDownloadLine" className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Download Video</h3>
                      <p className="text-sm text-muted-foreground">
                        Get your high-quality AI video instantly
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground">
                    The entire process, from upload to download, is designed for speed and efficiency, allowing you to create high-quality content without any waiting. 
                    This ease of use, combined with the professional-grade results, makes freegenie3 the ultimate tool for anyone looking to quickly generate captivating video content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Applications Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">
              The Many Applications of a Free Image to Video AI Generator
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Social Media Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Turn static product photos into engaging video ads for Instagram, TikTok, and other social platforms.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Marketing Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Create professional-quality marketing videos without the high cost of a production team.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Educational Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Transform diagrams and charts into animated presentations for better engagement.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Real Estate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Turn still photos of properties into captivating virtual tours and showcases.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Personal Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Create animated photo albums, personal video diaries, and memorable slideshows.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Business Presentations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Generate professional business pitches and presentations with dynamic visual elements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why Choose Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">
              Why freegenie3 is the Best Free Image to Video AI Platform
            </h2>
            
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    When it comes to choosing a <strong>free image to video AI</strong> tool, quality and reliability are paramount. 
                    freegenie3 stands out from the competition for several key reasons.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Icon name="RiCheckLine" className="w-6 h-6 text-green-500 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Truly Free Service</h3>
                          <p className="text-muted-foreground text-sm">
                            Our commitment to providing a truly free service without compromising on quality is unmatched.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icon name="RiCheckLine" className="w-6 h-6 text-green-500 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">High-Quality Results</h3>
                          <p className="text-muted-foreground text-sm">
                            State-of-the-art AI models ensure videos are high-quality, smooth, and professional-looking.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Icon name="RiCheckLine" className="w-6 h-6 text-green-500 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">Lightning Speed</h3>
                          <p className="text-muted-foreground text-sm">
                            Cloud-based processing ensures videos are generated in record time.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Icon name="RiCheckLine" className="w-6 h-6 text-green-500 mt-1" />
                        <div>
                          <h3 className="font-semibold mb-1">User-Friendly Interface</h3>
                          <p className="text-muted-foreground text-sm">
                            Clean, intuitive interface makes the entire process a breeze for everyone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center pt-6">
                    <Button asChild size="lg" className="px-8">
                      <Link href="/Image-to-Video">
                        <Icon name="RiRocketLine" className="w-5 h-5 mr-2" />
                        Try freegenie3 Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">
              FAQ: Your Questions About Our Free Image to Video AI Answered
            </h2>
            
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <Card key={index} className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg text-left">
                      <Icon name="RiQuestionLine" className="w-5 h-5 inline mr-2 text-primary" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    Ready to Transform Your Images into Amazing Videos?
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Join thousands of creators who use freegenie3's <strong>free image to video AI</strong> to bring their static images to life.
                  </p>
                  <Button asChild size="lg" className="px-8">
                    <Link href="/Image-to-Video">
                      <Icon name="RiStarLine" className="w-5 h-5 mr-2" />
                      Start Creating Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
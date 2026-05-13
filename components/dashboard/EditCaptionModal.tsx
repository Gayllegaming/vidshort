"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RemotionShortPlayer, { CaptionStyle } from "../RemotionShortPlayer";
import { Edit3, Save, RotateCcw, Palette, Type, Layout } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { CAPTION_DESIGNS, FONT_OPTIONS } from "@/config/caption-styles";
import { cn } from "@/lib/utils";

interface EditCaptionModalProps {
  short: any;
  videoUrl: string;
  onUpdate?: (newStyle: CaptionStyle) => void;
}

const DEFAULT_STYLE: CaptionStyle = {
  fontSize: 140,
  color: "#000000",
  backgroundColor: "#FFFF00",
  inactiveColor: "rgba(255, 255, 255, 0.6)",
  inactiveBackgroundColor: "transparent",
  fontWeight: "900",
  textTransform: "uppercase",
  borderRadius: 15,
  padding: "15px 30px",
  textShadow: "0 10px 30px rgba(0,0,0,0.5)",
};

export default function EditCaptionModal({ short, videoUrl, onUpdate }: EditCaptionModalProps) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CaptionStyle>(DEFAULT_STYLE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (short.captionStyle) {
      try {
        const parsed = typeof short.captionStyle === "string" 
          ? JSON.parse(short.captionStyle) 
          : short.captionStyle;
        setStyle({ ...DEFAULT_STYLE, ...parsed });
      } catch (e) {
        setStyle(DEFAULT_STYLE);
      }
    }
  }, [short.captionStyle, open]); // Re-sync when modal opens

  const handleUpdateStyle = (updates: Partial<CaptionStyle>) => {
    setStyle((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/shorts/${short.id}/style`, {
        captionStyle: style,
      });
      toast.success("Caption style updated successfully!");
      if (onUpdate) onUpdate(style);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save style:", error);
      toast.error("Failed to save caption style");
    } finally {
      setLoading(false);
    }
  };

  const resetStyle = () => {
    setStyle(DEFAULT_STYLE);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" size="sm" className="flex-1 gap-2 border-white/10 hover:bg-white/5 transition-all">
            <Edit3 className="w-4 h-4" /> Edit Style
          </Button>
        }
      />
      <DialogContent className="max-w-[95vw] w-full lg:max-w-7xl h-[95vh] lg:h-[90vh] flex flex-col p-0 overflow-hidden bg-[#080808] border-white/10 shadow-2xl">
        <DialogHeader className="p-6 border-b border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                Customize Your Short
              </DialogTitle>
              <p className="text-white/40 text-sm font-medium">Fine-tune how your captions appear on screen</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={resetStyle} className="text-white/40 hover:text-white hover:bg-white/5">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset to Default
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Side: Controls */}
          <div className="w-full lg:w-1/2 p-6 lg:p-10 overflow-y-auto border-r border-white/10 custom-scrollbar bg-white/[0.02]">
            <Tabs defaultValue="designs" className="w-full">
              <TabsList className="grid grid-cols-4 mb-10 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                <TabsTrigger value="designs" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Palette className="w-4 h-4 mr-2" /> Designs
                </TabsTrigger>
                <TabsTrigger value="typography" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Type className="w-4 h-4 mr-2" /> Text
                </TabsTrigger>
                <TabsTrigger value="colors" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Palette className="w-4 h-4 mr-2" /> Colors
                </TabsTrigger>
                <TabsTrigger value="layout" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  <Layout className="w-4 h-4 mr-2" /> Layout
                </TabsTrigger>
              </TabsList>

              <TabsContent value="designs" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
                <div className="grid grid-cols-3 gap-4">
                  {CAPTION_DESIGNS.map((design) => (
                    <div 
                      key={design.id}
                      onClick={() => setStyle(design.style)}
                      className={cn(
                        "group cursor-pointer p-3 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] flex flex-col items-center",
                        JSON.stringify(style) === JSON.stringify(design.style) 
                          ? "bg-primary/20 border-primary ring-1 ring-primary/50 shadow-[0_0_20px_rgba(124,58,237,0.3)]" 
                          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className="h-20 w-full rounded-xl mb-3 flex items-center justify-center overflow-hidden bg-gradient-to-br from-black/60 to-black/40 relative border border-white/5 shadow-inner">
                        <span 
                          className="font-black text-center leading-none"
                          style={{
                            ...design.style,
                            fontSize: 16,
                            padding: "4px 8px",
                            borderRadius: design.style.borderRadius ? design.style.borderRadius / 8 : 0,
                            transform: "none",
                            boxShadow: "none",
                            lineHeight: "1.2"
                          }}
                        >
                          ABC
                        </span>
                      </div>
                      <p className={cn(
                        "text-[10px] font-black text-center uppercase tracking-[0.1em] transition-colors",
                        JSON.stringify(style) === JSON.stringify(design.style) ? "text-primary" : "text-white/60 group-hover:text-white"
                      )}>
                        {design.name.split(' ')[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="typography" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <Label className="text-white font-bold">Font Size</Label>
                      <p className="text-white/40 text-xs">Adjust the scale of your words</p>
                    </div>
                    <span className="text-primary font-black font-mono text-lg">{style.fontSize}px</span>
                  </div>
                  <Slider
                    value={[style.fontSize || 140]}
                    min={40}
                    max={300}
                    step={1}
                    onValueChange={(val) => {
                      const value = Array.isArray(val) ? val[0] : val;
                      handleUpdateStyle({ fontSize: value });
                    }}
                    className="py-4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-white font-bold">Font Weight</Label>
                    <Select 
                      value={style.fontWeight ?? undefined} 
                      onValueChange={(val) => handleUpdateStyle({ fontWeight: val ?? undefined })}
                    >
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10 text-white">
                        <SelectItem value="400">Regular</SelectItem>
                        <SelectItem value="600">Semi Bold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                        <SelectItem value="900">Heavy / Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-white font-bold">Case Style</Label>
                    <Select 
                      value={style.textTransform ?? undefined} 
                      onValueChange={(val: any) => handleUpdateStyle({ textTransform: val ?? undefined })}
                    >
                      <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/10 text-white">
                        <SelectItem value="none">Normal Case</SelectItem>
                        <SelectItem value="uppercase">UPPERCASE</SelectItem>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="capitalize">Capitalize</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-bold">Font Family</Label>
                  <Select 
                    value={style.fontFamily ?? undefined} 
                    onValueChange={(val) => handleUpdateStyle({ fontFamily: val ?? undefined })}
                  >
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                      <SelectValue placeholder="System Default" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="colors" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-white font-bold">Active Word Color</Label>
                      <p className="text-white/40 text-xs">When the word is being spoken</p>
                    </div>
                    <div className="flex gap-3">
                      <div 
                        className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-lg cursor-pointer flex-shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: style.color }}
                      >
                        <Input 
                          type="color" 
                          value={style.color} 
                          onChange={(e) => handleUpdateStyle({ color: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <Input 
                        type="text" 
                        value={style.color} 
                        onChange={(e) => handleUpdateStyle({ color: e.target.value })}
                        className="flex-1 h-14 bg-white/5 border-white/10 text-white font-mono rounded-2xl px-4"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-white font-bold">Active Word BG</Label>
                      <p className="text-white/40 text-xs">Highlight background color</p>
                    </div>
                    <div className="flex gap-3">
                      <div 
                        className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-lg cursor-pointer flex-shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: style.backgroundColor }}
                      >
                        <Input 
                          type="color" 
                          value={style.backgroundColor} 
                          onChange={(e) => handleUpdateStyle({ backgroundColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <Input 
                        type="text" 
                        value={style.backgroundColor} 
                        onChange={(e) => handleUpdateStyle({ backgroundColor: e.target.value })}
                        className="flex-1 h-14 bg-white/5 border-white/10 text-white font-mono rounded-2xl px-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-white font-bold">Inactive Word Color</Label>
                      <p className="text-white/40 text-xs">When word is not being spoken</p>
                    </div>
                    <div className="flex gap-3">
                      <div 
                        className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-lg cursor-pointer flex-shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: style.inactiveColor }}
                      >
                        <Input 
                          type="color" 
                          value={style.inactiveColor} 
                          onChange={(e) => handleUpdateStyle({ inactiveColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <Input 
                        type="text" 
                        value={style.inactiveColor} 
                        onChange={(e) => handleUpdateStyle({ inactiveColor: e.target.value })}
                        className="flex-1 h-14 bg-white/5 border-white/10 text-white font-mono rounded-2xl px-4"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-white font-bold">Inactive Word BG</Label>
                      <p className="text-white/40 text-xs">Background for non-active words</p>
                    </div>
                    <div className="flex gap-3">
                      <div 
                        className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-lg cursor-pointer flex-shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: style.inactiveBackgroundColor === 'transparent' ? '#000000' : style.inactiveBackgroundColor }}
                      >
                        <Input 
                          type="color" 
                          value={style.inactiveBackgroundColor === 'transparent' ? '#000000' : style.inactiveBackgroundColor} 
                          onChange={(e) => handleUpdateStyle({ inactiveBackgroundColor: e.target.value })}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Input 
                          type="text" 
                          value={style.inactiveBackgroundColor} 
                          onChange={(e) => handleUpdateStyle({ inactiveBackgroundColor: e.target.value })}
                          className="flex-1 h-14 bg-white/5 border-white/10 text-white font-mono rounded-2xl px-4"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUpdateStyle({ inactiveBackgroundColor: 'transparent' })}
                          className="h-14 px-4 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white"
                        >
                          Transparent
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layout" className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <Label className="text-white font-bold">Corner Radius</Label>
                      <p className="text-white/40 text-xs">How rounded the word backgrounds are</p>
                    </div>
                    <span className="text-primary font-black font-mono text-lg">{style.borderRadius}px</span>
                  </div>
                  <Slider
                    value={[style.borderRadius || 0]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(val) => {
                      const value = Array.isArray(val) ? val[0] : val;
                      handleUpdateStyle({ borderRadius: value });
                    }}
                    className="py-4"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-white font-bold">Padding (CSS)</Label>
                  <p className="text-white/40 text-xs mb-3">Space around each word (e.g., 10px 20px)</p>
                  <Input 
                    value={style.padding} 
                    onChange={(e) => handleUpdateStyle({ padding: e.target.value })}
                    placeholder="e.g. 15px 30px"
                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-white font-bold">Text Effects (Shadow / Glow)</Label>
                  <p className="text-white/40 text-xs mb-3">Add depth with a shadow or glow</p>
                  <Input 
                    value={style.textShadow} 
                    onChange={(e) => handleUpdateStyle({ textShadow: e.target.value })}
                    placeholder="e.g. 5px 5px 20px rgba(0,0,0,0.5)"
                    className="h-12 bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side: Preview */}
          <div className="w-full lg:w-1/2 bg-[#050505] flex items-center justify-center p-8 lg:p-16 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full opacity-30" />
            
            <div className="relative w-full max-w-[340px] h-full max-h-[600px] aspect-[9/16] z-10">
              <div className="w-full h-full shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[32px] overflow-hidden border-8 border-white/5 relative group bg-black">
                <RemotionShortPlayer 
                  videoUrl={videoUrl} 
                  short={short} 
                  captionStyle={style} 
                  className="aspect-auto h-full w-full border-0 shadow-none rounded-none"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/10 animate-pulse">
                    Live Preview
                  </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[80%]">
                  <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Real-time Sync Active</span>
                  </div>
                </div>
              </div>

              {/* Player Stand/Shadow Effect */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-black/40 blur-xl rounded-full" />
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 border-t border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center justify-between w-full">
            <p className="text-white/30 text-xs hidden sm:block">Changes are saved instantly to your project.</p>
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setOpen(false)} 
                disabled={loading} 
                className="text-white/60 hover:text-white font-bold h-14 px-8 rounded-2xl"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading} 
                className="bg-primary hover:bg-primary/90 text-white px-10 h-14 rounded-2xl gap-3 font-black text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              >
                {loading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


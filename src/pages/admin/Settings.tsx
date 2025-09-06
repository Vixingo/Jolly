import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Bell,
    Store,
    Upload,
    X,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    MessageCircle,
    Palette,
} from "lucide-react";
import {
    getStoreSettings,
    updateStoreSettings,
    uploadStoreLogo,
    uploadStoreFavicon,
    CURRENCY_OPTIONS,
    type StoreSettingsFormData,
} from "../../lib/store-settings";
import { ColorPicker } from "../../components/ui/color-picker";
import { applyThemeColors, DEFAULT_THEME_COLORS } from "../../lib/theme-utils";
import { toast } from "sonner";

export default function AdminSettings() {
    const [storeSettings, setStoreSettings] = useState<StoreSettingsFormData>({
        store_name: "",
        store_description: "",
        store_email: "",
        store_phone: "",
        store_whatsapp: "",
        store_address: "",
        currency: "USD",
        favicon_url: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        linkedin_url: "",
        youtube_url: "",
        tiktok_url: "",
        privacy_policy: "",
        terms_of_service: "",
        return_policy: "",
        shipping_policy: "",
        theme_primary_color: DEFAULT_THEME_COLORS.primary,
        theme_secondary_color: DEFAULT_THEME_COLORS.secondary,
        theme_accent_color: DEFAULT_THEME_COLORS.accent,
    });

    const [currentLogo, setCurrentLogo] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [currentFavicon, setCurrentFavicon] = useState<string | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const logoFileInputRef = useRef<HTMLInputElement>(null);
    const faviconFileInputRef = useRef<HTMLInputElement>(null);

    const [notificationSettings, setNotificationSettings] = useState({
        orderNotifications: true,
        customerSignups: true,
        lowStockAlerts: true,
        marketingUpdates: false,
    });

    // Load store settings on component mount
    useEffect(() => {
        loadStoreSettings();
    }, []);

    const loadStoreSettings = async () => {
        setIsLoading(true);
        try {
            const settings = await getStoreSettings();
            if (settings) {
                setStoreSettings({
                    store_name: settings.store_name || "",
                    store_description: settings.store_description || "",
                    store_email: settings.store_email || "",
                    store_phone: settings.store_phone || "",
                    store_whatsapp: settings.store_whatsapp || "",
                    store_address: settings.store_address || "",
                    currency: settings.currency || "USD",
                    favicon_url: settings.favicon_url || "",
                    facebook_url: settings.facebook_url || "",
                    instagram_url: settings.instagram_url || "",
                    twitter_url: settings.twitter_url || "",
                    linkedin_url: settings.linkedin_url || "",
                    youtube_url: settings.youtube_url || "",
                    tiktok_url: settings.tiktok_url || "",
                    privacy_policy: settings.privacy_policy || "",
                    terms_of_service: settings.terms_of_service || "",
                    return_policy: settings.return_policy || "",
                    shipping_policy: settings.shipping_policy || "",
                    theme_primary_color:
                        settings.theme_primary_color ||
                        DEFAULT_THEME_COLORS.primary,
                    theme_secondary_color:
                        settings.theme_secondary_color ||
                        DEFAULT_THEME_COLORS.secondary,
                    theme_accent_color:
                        settings.theme_accent_color ||
                        DEFAULT_THEME_COLORS.accent,
                });
                setCurrentLogo(settings.logo_url || null);
                setCurrentFavicon(settings.favicon_url || null);
            }
        } catch (error) {
            console.error("Error loading store settings:", error);
            toast.error("Failed to load store settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStoreSettingChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setStoreSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCurrencyChange = (value: string) => {
        setStoreSettings((prev) => ({
            ...prev,
            currency: value,
        }));
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setLogoFile(file);

            // Create preview
            const reader = new FileReader();

            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreview(null);
        if (logoFileInputRef.current) {
            logoFileInputRef.current.value = "";
        }
    };

    const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Favicon size should be less than 2MB");
                return;
            }

            setFaviconFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setFaviconPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFavicon = () => {
        setFaviconFile(null);
        setFaviconPreview(null);
        if (faviconFileInputRef.current) {
            faviconFileInputRef.current.value = "";
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            let logoUrl = currentLogo;
            let logoStoragePath = "";
            let faviconUrl = currentFavicon;
            let faviconStoragePath = "";

            // Upload new logo if selected
            if (logoFile) {
                const uploadResult = await uploadStoreLogo(logoFile);
                if (uploadResult) {
                    logoUrl = uploadResult.url;
                    logoStoragePath = uploadResult.path;

                    // Delete old logo if exists
                    if (currentLogo) {
                        // Extract path from current logo URL if needed
                        // This is a simplified approach - you might need to store the path separately
                    }
                } else {
                    toast.error("Failed to upload logo");
                    return;
                }
            }

            // Upload new favicon if selected
            if (faviconFile) {
                const uploadResult = await uploadStoreFavicon(faviconFile);
                if (uploadResult) {
                    faviconUrl = uploadResult.url;
                    faviconStoragePath = uploadResult.path;

                    // Delete old favicon if exists
                    if (currentFavicon) {
                        // Extract path from current favicon URL if needed
                        // This is a simplified approach - you might need to store the path separately
                    }
                } else {
                    toast.error("Failed to upload favicon");
                    return;
                }
            }

            // Update store settings
            const updatedSettings = await updateStoreSettings({
                ...storeSettings,
                logo_url: logoUrl || undefined,
                logo_storage_path: logoStoragePath,
                favicon_url: faviconUrl || undefined,
                favicon_storage_path: faviconStoragePath,
            });

            if (updatedSettings) {
                setCurrentLogo(logoUrl);
                setLogoFile(null);
                setLogoPreview(null);
                if (logoFileInputRef.current) {
                    logoFileInputRef.current.value = "";
                }

                setCurrentFavicon(faviconUrl);
                setFaviconFile(null);
                setFaviconPreview(null);
                if (faviconFileInputRef.current) {
                    faviconFileInputRef.current.value = "";
                }

                toast.success("Store settings saved successfully!");
            } else {
                toast.error("Failed to save store settings");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save store settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleNotificationToggle = (
        setting: keyof typeof notificationSettings
    ) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };

    const handleThemeColorChange = (
        colorType:
            | "theme_primary_color"
            | "theme_secondary_color"
            | "theme_accent_color",
        color: string
    ) => {
        setStoreSettings((prev) => {
            const updated = {
                ...prev,
                [colorType]: color,
            };

            // Apply theme colors immediately for preview
            applyThemeColors({
                primary: updated.theme_primary_color,
                secondary: updated.theme_secondary_color,
                accent: updated.theme_accent_color,
            });

            return updated;
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="general"
                        className="flex items-center gap-2"
                    >
                        <Store className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger
                        value="theme"
                        className="flex items-center gap-2"
                    >
                        <Palette className="h-4 w-4" />
                        Theme
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="flex items-center gap-2"
                    >
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="security"
                        className="flex items-center gap-2"
                    >
                        <Bell className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="h-5 w-5" />
                                Store Information
                            </CardTitle>
                            <CardDescription>
                                Update your store details and contact
                                information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="store_name">
                                        Store Name
                                    </Label>
                                    <Input
                                        id="store_name"
                                        name="store_name"
                                        value={storeSettings.store_name}
                                        onChange={handleStoreSettingChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="store_email">
                                        Store Email
                                    </Label>
                                    <Input
                                        id="store_email"
                                        name="store_email"
                                        type="email"
                                        value={storeSettings.store_email}
                                        onChange={handleStoreSettingChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="store_phone">
                                        Store Phone
                                    </Label>
                                    <Input
                                        id="store_phone"
                                        name="store_phone"
                                        value={storeSettings.store_phone}
                                        onChange={handleStoreSettingChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="store_address">
                                        Store Address
                                    </Label>
                                    <Input
                                        id="store_address"
                                        name="store_address"
                                        value={storeSettings.store_address}
                                        onChange={handleStoreSettingChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="store_description">
                                    Store Description
                                </Label>
                                <Textarea
                                    id="store_description"
                                    name="store_description"
                                    value={storeSettings.store_description}
                                    onChange={handleStoreSettingChange}
                                    placeholder="Brief description of your store"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="store_whatsapp">
                                    WhatsApp Number
                                </Label>
                                <Input
                                    id="store_whatsapp"
                                    name="store_whatsapp"
                                    value={storeSettings.store_whatsapp}
                                    onChange={handleStoreSettingChange}
                                    placeholder="+1234567890"
                                />
                            </div>

                            <Separator className="my-6" />

                            {/* Logo Upload Section */}
                            <div className="space-y-4">
                                <Label>Store Logo</Label>
                                <div className="flex items-center gap-4">
                                    {(logoPreview || currentLogo) && (
                                        <div className="relative">
                                            <img
                                                src={
                                                    logoPreview ||
                                                    currentLogo ||
                                                    ""
                                                }
                                                alt="Store logo"
                                                className="w-20 h-20 object-contain border rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                onClick={handleRemoveLogo}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            ref={logoFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                logoFileInputRef.current?.click()
                                            }
                                            className="w-full"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {logoPreview || currentLogo
                                                ? "Change Logo"
                                                : "Upload Logo"}
                                        </Button>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Recommended: 200x200px, max 5MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Favicon Upload Section */}
                            <div className="space-y-4">
                                <Label>Store Favicon</Label>
                                <div className="flex items-center gap-4">
                                    {(faviconPreview || currentFavicon) && (
                                        <div className="relative">
                                            <img
                                                src={
                                                    faviconPreview ||
                                                    currentFavicon ||
                                                    ""
                                                }
                                                alt="Store favicon"
                                                className="w-12 h-12 object-contain border rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                onClick={handleRemoveFavicon}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <Input
                                            ref={faviconFileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFaviconUpload}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                faviconFileInputRef.current?.click()
                                            }
                                            className="w-full"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            {faviconPreview || currentFavicon
                                                ? "Change Favicon"
                                                : "Upload Favicon"}
                                        </Button>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Recommended: 32x32px or 64x64px, max
                                            2MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Currency Selection */}
                            <div className="space-y-2">
                                <Label>Store Currency</Label>
                                <Select
                                    value={storeSettings.currency}
                                    onValueChange={handleCurrencyChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CURRENCY_OPTIONS.map((currency) => (
                                            <SelectItem
                                                key={currency.value}
                                                value={currency.value}
                                            >
                                                {currency.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator className="my-6" />

                            {/* Social Media Links */}
                            <div className="space-y-4">
                                <Label>Social Media Links</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="facebook_url"
                                            className="flex items-center gap-2"
                                        >
                                            <Facebook className="h-4 w-4" />
                                            Facebook
                                        </Label>
                                        <Input
                                            id="facebook_url"
                                            name="facebook_url"
                                            value={storeSettings.facebook_url}
                                            onChange={handleStoreSettingChange}
                                            placeholder="https://facebook.com/yourstore"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="instagram_url"
                                            className="flex items-center gap-2"
                                        >
                                            <Instagram className="h-4 w-4" />
                                            Instagram
                                        </Label>
                                        <Input
                                            id="instagram_url"
                                            name="instagram_url"
                                            value={storeSettings.instagram_url}
                                            onChange={handleStoreSettingChange}
                                            placeholder="https://instagram.com/yourstore"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="twitter_url"
                                            className="flex items-center gap-2"
                                        >
                                            <Twitter className="h-4 w-4" />
                                            Twitter
                                        </Label>
                                        <Input
                                            id="twitter_url"
                                            name="twitter_url"
                                            value={storeSettings.twitter_url}
                                            onChange={handleStoreSettingChange}
                                            placeholder="https://twitter.com/yourstore"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="linkedin_url"
                                            className="flex items-center gap-2"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                            LinkedIn
                                        </Label>
                                        <Input
                                            id="linkedin_url"
                                            name="linkedin_url"
                                            value={storeSettings.linkedin_url}
                                            onChange={handleStoreSettingChange}
                                            placeholder="https://linkedin.com/company/yourstore"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="youtube_url"
                                            className="flex items-center gap-2"
                                        >
                                            <Youtube className="h-4 w-4" />
                                            YouTube
                                        </Label>
                                        <Input
                                            id="youtube_url"
                                            name="youtube_url"
                                            value={storeSettings.youtube_url}
                                            onChange={handleStoreSettingChange}
                                            placeholder="https://youtube.com/@yourstore"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="tiktok_url"
                                            className="flex items-center gap-2"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            TikTok
                                        </Label>
                                        <Input
                                            id="tiktok_url"
                                            name="tiktok_url"
                                            value={storeSettings.tiktok_url}
                                            onChange={handleStoreSettingChange}
                                            placeholder="https://tiktok.com/@yourstore"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Store Policies */}
                            <div className="space-y-4">
                                <Label>Store Policies</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="privacy_policy">
                                            Privacy Policy
                                        </Label>
                                        <Textarea
                                            id="privacy_policy"
                                            name="privacy_policy"
                                            value={storeSettings.privacy_policy}
                                            onChange={handleStoreSettingChange}
                                            placeholder="Your privacy policy..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="terms_of_service">
                                            Terms of Service
                                        </Label>
                                        <Textarea
                                            id="terms_of_service"
                                            name="terms_of_service"
                                            value={
                                                storeSettings.terms_of_service
                                            }
                                            onChange={handleStoreSettingChange}
                                            placeholder="Your terms of service..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="return_policy">
                                            Return Policy
                                        </Label>
                                        <Textarea
                                            id="return_policy"
                                            name="return_policy"
                                            value={storeSettings.return_policy}
                                            onChange={handleStoreSettingChange}
                                            placeholder="Your return policy..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_policy">
                                            Shipping Policy
                                        </Label>
                                        <Textarea
                                            id="shipping_policy"
                                            name="shipping_policy"
                                            value={
                                                storeSettings.shipping_policy
                                            }
                                            onChange={handleStoreSettingChange}
                                            placeholder="Your shipping policy..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSaveSettings}
                                disabled={isSaving || isLoading}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="theme">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Theme Colors
                            </CardTitle>
                            <CardDescription>
                                Customize your store's theme colors. Changes
                                will be applied immediately for preview.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Primary Color</Label>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Main brand color used for buttons and
                                        highlights
                                    </p>
                                    <ColorPicker
                                        value={
                                            storeSettings.theme_primary_color
                                        }
                                        onChange={(color) =>
                                            handleThemeColorChange(
                                                "theme_primary_color",
                                                color
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Secondary Color</Label>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Supporting color for secondary elements
                                    </p>
                                    <ColorPicker
                                        value={
                                            storeSettings.theme_secondary_color
                                        }
                                        onChange={(color) =>
                                            handleThemeColorChange(
                                                "theme_secondary_color",
                                                color
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Accent Color</Label>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Accent color for special highlights and
                                        CTAs
                                    </p>
                                    <ColorPicker
                                        value={storeSettings.theme_accent_color}
                                        onChange={(color) =>
                                            handleThemeColorChange(
                                                "theme_accent_color",
                                                color
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Preview</h4>
                                <div className="p-4 border rounded-lg space-y-3">
                                    <div className="flex gap-2">
                                        <Button size="sm">
                                            Primary Button
                                        </Button>
                                        <Button variant="secondary" size="sm">
                                            Secondary Button
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            Outline Button
                                        </Button>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        This preview shows how your theme colors
                                        will appear on buttons and other
                                        elements.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={handleSaveSettings}
                                disabled={isSaving || isLoading}
                            >
                                {isSaving ? "Saving..." : "Save Theme Colors"}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose which notifications you want to receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="orderNotifications">
                                            Order Notifications
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications when new
                                            orders are placed
                                        </p>
                                    </div>
                                    <Switch
                                        id="orderNotifications"
                                        checked={
                                            notificationSettings.orderNotifications
                                        }
                                        onCheckedChange={() =>
                                            handleNotificationToggle(
                                                "orderNotifications"
                                            )
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="customerSignups">
                                            Customer Signups
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive notifications when new
                                            customers register
                                        </p>
                                    </div>
                                    <Switch
                                        id="customerSignups"
                                        checked={
                                            notificationSettings.customerSignups
                                        }
                                        onCheckedChange={() =>
                                            handleNotificationToggle(
                                                "customerSignups"
                                            )
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="lowStockAlerts">
                                            Low Stock Alerts
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Get notified when product inventory
                                            is running low
                                        </p>
                                    </div>
                                    <Switch
                                        id="lowStockAlerts"
                                        checked={
                                            notificationSettings.lowStockAlerts
                                        }
                                        onCheckedChange={() =>
                                            handleNotificationToggle(
                                                "lowStockAlerts"
                                            )
                                        }
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="marketingUpdates">
                                            Marketing Updates
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receive marketing and promotional
                                            information
                                        </p>
                                    </div>
                                    <Switch
                                        id="marketingUpdates"
                                        checked={
                                            notificationSettings.marketingUpdates
                                        }
                                        onCheckedChange={() =>
                                            handleNotificationToggle(
                                                "marketingUpdates"
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your account security and authentication
                                settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">
                                        Current Password
                                    </Label>
                                    <Input
                                        id="currentPassword"
                                        type="password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">
                                        New Password
                                    </Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm New Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                    />
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Two-Factor Authentication</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <Button variant="outline">Enable</Button>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Session Management</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Manage your active sessions and
                                            devices
                                        </p>
                                    </div>
                                    <Button variant="outline">
                                        View Sessions
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Update Security Settings</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
